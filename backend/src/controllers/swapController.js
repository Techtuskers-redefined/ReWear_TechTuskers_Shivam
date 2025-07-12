const Item = require("../models/Item")
const User = require("../models/User")
const Swap = require("../models/Swap")
const Notification = require("../models/Notification")

// @desc    Create a new item-to-item swap request
// @route   POST /api/swaps/create
// @access  Private
const createSwap = async (req, res) => {
  try {
    const { offeredItemId, requestedItemId, message } = req.body

    // Validate input
    if (!offeredItemId || !requestedItemId) {
      return res.status(400).json({
        success: false,
        message: "Both offered and requested items are required",
      })
    }

    // Get the items with their owners
    const offeredItem = await Item.findById(offeredItemId).populate("owner", "name email")
    const requestedItem = await Item.findById(requestedItemId).populate("owner", "name email")

    if (!offeredItem || !requestedItem) {
      return res.status(404).json({
        success: false,
        message: "One or both items not found",
      })
    }

    // Check if items are available
    if (offeredItem.status !== "available" || requestedItem.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "One or both items are not available for swap",
      })
    }

    // Check if user owns the offered item
    if (offeredItem.owner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only offer items that you own",
      })
    }

    // Check if user is not requesting their own item
    if (requestedItem.owner._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request to swap for your own item",
      })
    }

    // Check if there's already a pending swap for either item
    const existingSwap = await Swap.findOne({
      $or: [
        { offeredItem: offeredItemId, status: "pending" },
        { requestedItem: requestedItemId, status: "pending" },
        { offeredItem: requestedItemId, status: "pending" },
        { requestedItem: offeredItemId, status: "pending" },
      ],
    })

    if (existingSwap) {
      return res.status(400).json({
        success: false,
        message: "One or both items are already involved in a pending swap",
      })
    }

    // Calculate point difference
    const pointDifference = requestedItem.pointValue - offeredItem.pointValue

    // Check if users have sufficient points
    const initiatorUser = await User.findById(req.user.id)
    const recipientUser = await User.findById(requestedItem.owner._id)

    if (pointDifference > 0 && initiatorUser.points < pointDifference) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You need ${pointDifference} points to complete this swap.`,
        data: {
          requiredPoints: pointDifference,
          currentPoints: initiatorUser.points,
        },
      })
    }

    if (pointDifference < 0 && recipientUser.points < Math.abs(pointDifference)) {
      return res.status(400).json({
        success: false,
        message: `The item owner doesn't have enough points to complete this swap.`,
      })
    }

    // Create the swap
    const swap = new Swap({
      initiator: req.user.id,
      recipient: requestedItem.owner._id,
      offeredItem: offeredItemId,
      requestedItem: requestedItemId,
      pointDifference,
      message: message || "",
    })

    await swap.save()

    // Create notification for recipient
    await Notification.createNotification({
      recipient: requestedItem.owner._id,
      sender: req.user.id,
      type: "swap_request",
      title: "New swap request",
      message: `${req.user.name} wants to swap "${offeredItem.title}" for your "${requestedItem.title}"`,
      relatedItem: requestedItem._id,
      relatedUser: req.user.id,
      actionUrl: `/dashboard/swaps`,
    })

    res.status(201).json({
      success: true,
      message: "Swap request created successfully",
      data: {
        swap: {
          id: swap._id,
          pointDifference,
          status: swap.status,
        },
      },
    })
  } catch (error) {
    console.error("Create swap error:", error)
    res.status(500).json({
      success: false,
      message: "Server error creating swap",
    })
  }
}

// @desc    Respond to a swap request (accept/reject/counter-offer)
// @route   PUT /api/swaps/:swapId/respond
// @access  Private
const respondToSwap = async (req, res) => {
  try {
    const { action, counterOffer } = req.body
    const { swapId } = req.params

    const swap = await Swap.findById(swapId)
      .populate("initiator", "name email points")
      .populate("recipient", "name email points")
      .populate("offeredItem", "title pointValue")
      .populate("requestedItem", "title pointValue")

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Swap not found",
      })
    }

    // Check if user is the recipient
    if (swap.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to respond to this swap",
      })
    }

    if (swap.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Swap has already been responded to",
      })
    }

    if (action === "accept") {
      // Check if users still have sufficient points
      const initiatorUser = await User.findById(swap.initiator._id)
      const recipientUser = await User.findById(swap.recipient._id)

      if (swap.pointDifference > 0 && initiatorUser.points < swap.pointDifference) {
        return res.status(400).json({
          success: false,
          message: "Initiator no longer has sufficient points for this swap",
        })
      }

      if (swap.pointDifference < 0 && recipientUser.points < Math.abs(swap.pointDifference)) {
        return res.status(400).json({
          success: false,
          message: "You no longer have sufficient points for this swap",
        })
      }

      // Execute the swap
      await executeSwap(swap, initiatorUser, recipientUser)

      // Create notifications
      await Notification.createNotification({
        recipient: swap.initiator._id,
        sender: req.user.id,
        type: "swap_accepted",
        title: "Swap accepted!",
        message: `${req.user.name} accepted your swap request`,
        relatedItem: swap.requestedItem._id,
        relatedUser: req.user.id,
      })

      res.json({
        success: true,
        message: "Swap accepted and completed successfully",
      })
    } else if (action === "reject") {
      swap.status = "rejected"
      swap.respondedAt = new Date()
      await swap.save()

      // Create notification for initiator
      await Notification.createNotification({
        recipient: swap.initiator._id,
        sender: req.user.id,
        type: "swap_rejected",
        title: "Swap request declined",
        message: `${req.user.name} declined your swap request`,
        relatedItem: swap.requestedItem._id,
        relatedUser: req.user.id,
      })

      res.json({
        success: true,
        message: "Swap request rejected",
      })
    } else if (action === "counter") {
      if (!counterOffer || typeof counterOffer.pointDifference !== "number") {
        return res.status(400).json({
          success: false,
          message: "Counter offer must include point difference",
        })
      }

      // Check if recipient has sufficient points for counter offer
      if (counterOffer.pointDifference < 0) {
        const recipientUser = await User.findById(swap.recipient._id)
        if (recipientUser.points < Math.abs(counterOffer.pointDifference)) {
          return res.status(400).json({
            success: false,
            message: "You don't have enough points for this counter offer",
          })
        }
      }

      swap.counterOffer = {
        pointDifference: counterOffer.pointDifference,
        message: counterOffer.message || "",
        createdAt: new Date(),
      }
      swap.respondedAt = new Date()
      await swap.save()

      // Create notification for initiator
      await Notification.createNotification({
        recipient: swap.initiator._id,
        sender: req.user.id,
        type: "swap_counter",
        title: "Counter offer received",
        message: `${req.user.name} made a counter offer for your swap request`,
        relatedItem: swap.requestedItem._id,
        relatedUser: req.user.id,
      })

      res.json({
        success: true,
        message: "Counter offer sent successfully",
        data: {
          counterOffer: swap.counterOffer,
        },
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'accept', 'reject', or 'counter'",
      })
    }
  } catch (error) {
    console.error("Respond to swap error:", error)
    res.status(500).json({
      success: false,
      message: "Server error responding to swap",
    })
  }
}

// @desc    Respond to counter offer
// @route   PUT /api/swaps/:swapId/counter-response
// @access  Private
const respondToCounterOffer = async (req, res) => {
  try {
    const { action } = req.body
    const { swapId } = req.params

    const swap = await Swap.findById(swapId)
      .populate("initiator", "name email points")
      .populate("recipient", "name email points")
      .populate("offeredItem", "title pointValue")
      .populate("requestedItem", "title pointValue")

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Swap not found",
      })
    }

    // Check if user is the initiator
    if (swap.initiator._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to respond to this counter offer",
      })
    }

    if (!swap.counterOffer) {
      return res.status(400).json({
        success: false,
        message: "No counter offer to respond to",
      })
    }

    if (action === "accept") {
      // Check if users have sufficient points for counter offer
      const initiatorUser = await User.findById(swap.initiator._id)
      const recipientUser = await User.findById(swap.recipient._id)

      if (swap.counterOffer.pointDifference > 0 && initiatorUser.points < swap.counterOffer.pointDifference) {
        return res.status(400).json({
          success: false,
          message: "You don't have enough points for this counter offer",
        })
      }

      if (swap.counterOffer.pointDifference < 0 && recipientUser.points < Math.abs(swap.counterOffer.pointDifference)) {
        return res.status(400).json({
          success: false,
          message: "Recipient no longer has sufficient points for this counter offer",
        })
      }

      // Update swap with counter offer terms
      swap.pointDifference = swap.counterOffer.pointDifference
      swap.counterOffer = null
      swap.status = "accepted"

      // Execute the swap
      await executeSwap(swap, initiatorUser, recipientUser)

      // Create notification for recipient
      await Notification.createNotification({
        recipient: swap.recipient._id,
        sender: req.user.id,
        type: "swap_accepted",
        title: "Counter offer accepted!",
        message: `${req.user.name} accepted your counter offer`,
        relatedItem: swap.offeredItem._id,
        relatedUser: req.user.id,
      })

      res.json({
        success: true,
        message: "Counter offer accepted and swap completed",
      })
    } else if (action === "reject") {
      swap.status = "rejected"
      swap.counterOffer = null
      await swap.save()

      // Create notification for recipient
      await Notification.createNotification({
        recipient: swap.recipient._id,
        sender: req.user.id,
        type: "swap_rejected",
        title: "Counter offer declined",
        message: `${req.user.name} declined your counter offer`,
        relatedItem: swap.offeredItem._id,
        relatedUser: req.user.id,
      })

      res.json({
        success: true,
        message: "Counter offer rejected",
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'accept' or 'reject'",
      })
    }
  } catch (error) {
    console.error("Respond to counter offer error:", error)
    res.status(500).json({
      success: false,
      message: "Server error responding to counter offer",
    })
  }
}

// @desc    Get user's swap history
// @route   GET /api/swaps/history
// @access  Private
const getSwapHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query

    const query = {
      $or: [{ initiator: req.user.id }, { recipient: req.user.id }],
    }

    if (status) {
      query.status = status
    }

    const swaps = await Swap.find(query)
      .populate("initiator", "name avatar")
      .populate("recipient", "name avatar")
      .populate("offeredItem", "title images pointValue")
      .populate("requestedItem", "title images pointValue")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Swap.countDocuments(query)

    res.json({
      success: true,
      data: {
        swaps,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Get swap history error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching swap history",
    })
  }
}

// @desc    Get pending swaps for user
// @route   GET /api/swaps/pending
// @access  Private
const getPendingSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ initiator: req.user.id }, { recipient: req.user.id }],
      status: "pending",
    })
      .populate("initiator", "name avatar")
      .populate("recipient", "name avatar")
      .populate("offeredItem", "title images pointValue")
      .populate("requestedItem", "title images pointValue")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: {
        swaps,
      },
    })
  } catch (error) {
    console.error("Get pending swaps error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching pending swaps",
    })
  }
}

// Helper function to execute a swap
const executeSwap = async (swap, initiatorUser, recipientUser) => {
  // Transfer points
  if (swap.pointDifference > 0) {
    // Initiator pays points to recipient
    initiatorUser.points -= swap.pointDifference
    initiatorUser.stats.pointsSpent += swap.pointDifference
    recipientUser.points += swap.pointDifference
    recipientUser.stats.pointsEarned += swap.pointDifference
  } else if (swap.pointDifference < 0) {
    // Recipient pays points to initiator
    recipientUser.points -= Math.abs(swap.pointDifference)
    recipientUser.stats.pointsSpent += Math.abs(swap.pointDifference)
    initiatorUser.points += Math.abs(swap.pointDifference)
    initiatorUser.stats.pointsEarned += Math.abs(swap.pointDifference)
  }

  // Transfer items
  const offeredItem = await Item.findById(swap.offeredItem)
  const requestedItem = await Item.findById(swap.requestedItem)

  offeredItem.owner = swap.recipient
  requestedItem.owner = swap.initiator

  // Update item statuses
  offeredItem.status = "swapped"
  requestedItem.status = "swapped"

  // Update user stats
  initiatorUser.stats.itemsSwapped += 1
  recipientUser.stats.itemsSwapped += 1

  // Save all changes
  await Promise.all([
    initiatorUser.save(),
    recipientUser.save(),
    offeredItem.save(),
    requestedItem.save(),
  ])

  // Update swap status
  swap.status = "completed"
  swap.completedAt = new Date()
  await swap.save()
}

// Keep existing functions for backward compatibility
// @desc    Request swap for an item (legacy)
// @route   POST /api/swaps/:itemId/request
// @access  Private
const requestSwap = async (req, res) => {
  try {
    const { message } = req.body
    const item = await Item.findById(req.params.itemId).populate("owner", "name email")

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    if (item.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Item is not available for swap",
      })
    }

    if (item.owner._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request swap for your own item",
      })
    }

    // Check if user already requested swap for this item
    const existingRequest = item.pendingSwaps.find((swap) => swap.requester.toString() === req.user.id)

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You have already requested swap for this item",
      })
    }

    // Add swap request
    item.pendingSwaps.push({
      requester: req.user.id,
      message: message || "",
      status: "pending",
    })

    await item.save()

    // Create notification for item owner
    await Notification.createNotification({
      recipient: item.owner._id,
      sender: req.user.id,
      type: "swap_request",
      title: "New swap request",
      message: `${req.user.name} wants to swap for your item "${item.title}"`,
      relatedItem: item._id,
      relatedUser: req.user.id,
      actionUrl: `/dashboard/swaps`,
    })

    res.json({
      success: true,
      message: "Swap request sent successfully",
    })
  } catch (error) {
    console.error("Request swap error:", error)
    res.status(500).json({
      success: false,
      message: "Server error requesting swap",
    })
  }
}

// @desc    Respond to swap request (legacy)
// @route   PUT /api/swaps/:itemId/respond/:requestId
// @access  Private
const respondToLegacySwap = async (req, res) => {
  try {
    const { action } = req.body // 'accept' or 'reject'
    const { itemId, requestId } = req.params

    const item = await Item.findById(itemId).populate("pendingSwaps.requester", "name email")

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to respond to this swap request",
      })
    }

    const swapRequest = item.pendingSwaps.id(requestId)
    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      })
    }

    if (swapRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Swap request has already been responded to",
      })
    }

    const requester = await User.findById(swapRequest.requester._id)

    if (action === "accept") {
      swapRequest.status = "accepted"
      item.status = "swapped"

      // Update user stats
      await req.user.updateStats("itemSwapped")
      await requester.updateStats("itemSwapped")

      // Create notification for requester
      await Notification.createNotification({
        recipient: requester._id,
        sender: req.user.id,
        type: "swap_accepted",
        title: "Swap request accepted!",
        message: `${req.user.name} accepted your swap request for "${item.title}"`,
        relatedItem: item._id,
        relatedUser: req.user.id,
        actionUrl: `/item/${item._id}`,
      })

      // Reject all other pending requests for this item
      item.pendingSwaps.forEach((swap) => {
        if (swap._id.toString() !== requestId && swap.status === "pending") {
          swap.status = "rejected"
        }
      })
    } else if (action === "reject") {
      swapRequest.status = "rejected"

      // Create notification for requester
      await Notification.createNotification({
        recipient: requester._id,
        sender: req.user.id,
        type: "swap_rejected",
        title: "Swap request declined",
        message: `${req.user.name} declined your swap request for "${item.title}"`,
        relatedItem: item._id,
        relatedUser: req.user.id,
      })
    }

    await item.save()

    res.json({
      success: true,
      message: `Swap request ${action}ed successfully`,
    })
  } catch (error) {
    console.error("Respond to swap error:", error)
    res.status(500).json({
      success: false,
      message: "Server error responding to swap",
    })
  }
}

// @desc    Redeem item with points
// @route   POST /api/swaps/:itemId/redeem
// @access  Private
const redeemWithPoints = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).populate("owner", "name email")

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    if (item.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Item is not available for redemption",
      })
    }

    if (item.owner._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot redeem your own item",
      })
    }

    if (req.user.points < item.pointValue) {
      return res.status(400).json({
        success: false,
        message: "Insufficient points to redeem this item",
      })
    }

    // Deduct points from user
    await req.user.updateStats("pointsSpent", item.pointValue)

    // Add points to item owner
    const owner = await User.findById(item.owner._id)
    owner.points += item.pointValue
    owner.stats.pointsEarned += item.pointValue
    await owner.save()

    // Update item status
    item.status = "swapped"
    await item.save()

    // Create notifications
    await Notification.createNotification({
      recipient: req.user.id,
      type: "points_earned",
      title: "Item redeemed successfully!",
      message: `You redeemed "${item.title}" for ${item.pointValue} points`,
      relatedItem: item._id,
    })

    await Notification.createNotification({
      recipient: item.owner._id,
      sender: req.user.id,
      type: "points_earned",
      title: "Item redeemed!",
      message: `${req.user.name} redeemed your item "${item.title}" for ${item.pointValue} points`,
      relatedItem: item._id,
      relatedUser: req.user.id,
    })

    res.json({
      success: true,
      message: "Item redeemed successfully",
      data: {
        pointsSpent: item.pointValue,
        remainingPoints: req.user.points,
      },
    })
  } catch (error) {
    console.error("Redeem with points error:", error)
    res.status(500).json({
      success: false,
      message: "Server error redeeming item",
    })
  }
}

module.exports = {
  createSwap,
  respondToSwap,
  respondToCounterOffer,
  getSwapHistory,
  getPendingSwaps,
  requestSwap,
  respondToLegacySwap,
  redeemWithPoints,
}
