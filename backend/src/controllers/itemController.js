const Item = require("../models/Item")
const User = require("../models/User")
const Notification = require("../models/Notification")
const { validationResult } = require("express-validator")
const { cloudinary } = require("../config/cloudinary")

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { title, description, category, size, condition, gender, brand, color, material, tags, swapPreferences } =
      req.body

    // Process uploaded images
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }))
      : []

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      })
    }

    // Create item
    const item = await Item.create({
      title,
      description,
      category,
      size,
      condition,
      gender,
      brand,
      color,
      material,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      swapPreferences,
      owner: req.user.id,
      images,
      isApproved: true, // Auto-approve for now
      approvedBy: req.user.id,
      approvedAt: new Date(),
    })

    // Update user stats
    await req.user.updateStats("itemListed")

    // Create notification for item submission
    await Notification.createNotification({
      recipient: req.user.id,
      type: "system",
      title: "Item submitted for review",
      message: `Your item "${title}" has been submitted and is pending approval.`,
      relatedItem: item._id,
    })

    const populatedItem = await Item.findById(item._id).populate("owner", "name email avatar")

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: { item: populatedItem },
    })
  } catch (error) {
    console.error("Create item error:", error)

    // Clean up uploaded images if item creation fails
    if (req.files) {
      req.files.forEach(async (file) => {
        try {
          await cloudinary.uploader.destroy(file.filename)
        } catch (cleanupError) {
          console.error("Error cleaning up image:", cleanupError)
        }
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error creating item",
    })
  }
}

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      size,
      condition,
      gender,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      status = "available",
    } = req.query

    // Build query
    const query = { status, isApproved: true }

    if (category && category !== "all") query.category = category
    if (size && size !== "all") query.size = size
    if (condition && condition !== "all") query.condition = condition
    if (gender && gender !== "all") query.gender = gender

    if (search) {
      query.$text = { $search: search }
    }

    // Execute query
    const items = await Item.find(query)
      .populate("owner", "name avatar location")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const total = await Item.countDocuments(query)

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
    console.error("Get items error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching items",
    })
  }
}

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("owner", "name email avatar location stats")
      .populate("pendingSwaps.requester", "name avatar")
      .populate("likes.user", "name avatar")

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    // Increment views
    item.views += 1
    await item.save()

    res.json({
      success: true,
      data: { item },
    })
  } catch (error) {
    console.error("Get item error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching item",
    })
  }
}

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    // Check ownership
    if (item.owner.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      })
    }

    const {
      title,
      description,
      category,
      size,
      condition,
      gender,
      brand,
      color,
      material,
      tags,
      swapPreferences,
      status,
    } = req.body

    // Update fields
    if (title) item.title = title
    if (description) item.description = description
    if (category) item.category = category
    if (size) item.size = size
    if (condition) item.condition = condition
    if (gender) item.gender = gender
    if (brand) item.brand = brand
    if (color) item.color = color
    if (material) item.material = material
    if (tags) item.tags = tags.split(",").map((tag) => tag.trim())
    if (swapPreferences) item.swapPreferences = swapPreferences
    if (status && req.user.isAdmin) item.status = status

    await item.save()

    const updatedItem = await Item.findById(item._id).populate("owner", "name email avatar")

    res.json({
      success: true,
      message: "Item updated successfully",
      data: { item: updatedItem },
    })
  } catch (error) {
    console.error("Update item error:", error)
    res.status(500).json({
      success: false,
      message: "Server error updating item",
    })
  }
}

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    // Check ownership
    if (item.owner.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      })
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      for (const image of item.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId)
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error)
        }
      }
    }

    await Item.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Item deleted successfully",
    })
  } catch (error) {
    console.error("Delete item error:", error)
    res.status(500).json({
      success: false,
      message: "Server error deleting item",
    })
  }
}

// @desc    Like/Unlike item
// @route   POST /api/items/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    const existingLike = item.likes.find((like) => like.user.toString() === req.user.id)

    if (existingLike) {
      // Unlike
      item.likes = item.likes.filter((like) => like.user.toString() !== req.user.id)
    } else {
      // Like
      item.likes.push({ user: req.user.id })

      // Create notification for item owner
      if (item.owner.toString() !== req.user.id) {
        await Notification.createNotification({
          recipient: item.owner,
          sender: req.user.id,
          type: "item_liked",
          title: "Item liked",
          message: `${req.user.name} liked your item "${item.title}"`,
          relatedItem: item._id,
          relatedUser: req.user.id,
        })
      }
    }

    await item.save()

    res.json({
      success: true,
      message: existingLike ? "Item unliked" : "Item liked",
      data: { likes: item.likes.length },
    })
  } catch (error) {
    console.error("Toggle like error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// @desc    Get user's items
// @route   GET /api/items/my-items
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    const query = { owner: req.user.id, isApproved: true }
    if (status) query.status = status

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("pendingSwaps.requester", "name avatar")

    const total = await Item.countDocuments(query)

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
    console.error("Get my items error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching items",
    })
  }
}

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  toggleLike,
  getMyItems,
}
