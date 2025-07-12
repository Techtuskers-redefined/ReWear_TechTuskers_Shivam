const express = require("express")
const Item = require("../models/Item")
const User = require("../models/User")
const Notification = require("../models/Notification")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

// Apply admin middleware to all routes
router.use(protect, admin)

// @desc    Get all pending items for approval
// @route   GET /api/admin/items/pending
// @access  Private/Admin
router.get("/items/pending", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query

    const items = await Item.find({ isApproved: false })
      .populate("owner", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Item.countDocuments({ isApproved: false })

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page: Number.parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Get pending items error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching pending items",
    })
  }
})

// @desc    Approve item
// @route   PUT /api/admin/items/:id/approve
// @access  Private/Admin
router.put("/items/:id/approve", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "name email")

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    item.isApproved = true
    item.approvedBy = req.user.id
    item.approvedAt = new Date()
    await item.save()

    // Create notification for item owner
    await Notification.createNotification({
      recipient: item.owner._id,
      sender: req.user.id,
      type: "item_approved",
      title: "Item approved!",
      message: `Your item "${item.title}" has been approved and is now live`,
      relatedItem: item._id,
      actionUrl: `/item/${item._id}`,
    })

    res.json({
      success: true,
      message: "Item approved successfully",
    })
  } catch (error) {
    console.error("Approve item error:", error)
    res.status(500).json({
      success: false,
      message: "Server error approving item",
    })
  }
})

// @desc    Reject item
// @route   PUT /api/admin/items/:id/reject
// @access  Private/Admin
router.put("/items/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body
    const item = await Item.findById(req.params.id).populate("owner", "name email")

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    item.status = "removed"
    item.rejectionReason = reason
    await item.save()

    // Create notification for item owner
    await Notification.createNotification({
      recipient: item.owner._id,
      sender: req.user.id,
      type: "item_rejected",
      title: "Item rejected",
      message: `Your item "${item.title}" was rejected. Reason: ${reason}`,
      relatedItem: item._id,
    })

    res.json({
      success: true,
      message: "Item rejected successfully",
    })
  } catch (error) {
    console.error("Reject item error:", error)
    res.status(500).json({
      success: false,
      message: "Server error rejecting item",
    })
  }
})

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query

    const query = {}
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number.parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
    })
  }
})

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalItems = await Item.countDocuments()
    const pendingItems = await Item.countDocuments({ isApproved: false })
    const activeItems = await Item.countDocuments({ status: "available", isApproved: true })
    const swappedItems = await Item.countDocuments({ status: "swapped" })

    // Get recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt")
    const recentItems = await Item.find()
      .populate("owner", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title owner createdAt status")

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalItems,
          pendingItems,
          activeItems,
          swappedItems,
        },
        recentActivity: {
          recentUsers,
          recentItems,
        },
      },
    })
  } catch (error) {
    console.error("Get admin stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching admin stats",
    })
  }
})

module.exports = router
