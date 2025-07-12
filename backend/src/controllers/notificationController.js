const Notification = require("../models/Notification")

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query

    const query = { recipient: req.user.id }
    if (unreadOnly === "true") {
      query.isRead = false
    }

    const notifications = await Notification.find(query)
      .populate("sender", "name avatar")
      .populate("relatedItem", "title images")
      .populate("relatedUser", "name avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    })

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: Number.parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching notifications",
    })
  }
}

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this notification as read",
      })
    }

    await notification.markAsRead()

    res.json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Mark as read error:", error)
    res.status(500).json({
      success: false,
      message: "Server error marking notification as read",
    })
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true, readAt: new Date() })

    res.json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    console.error("Mark all as read error:", error)
    res.status(500).json({
      success: false,
      message: "Server error marking all notifications as read",
    })
  }
}

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      })
    }

    await Notification.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Delete notification error:", error)
    res.status(500).json({
      success: false,
      message: "Server error deleting notification",
    })
  }
}

// @desc    Create notification (admin only)
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = async (req, res) => {
  try {
    const { recipient, type, title, message, relatedItem, relatedUser } = req.body

    const notification = await Notification.createNotification({
      recipient,
      sender: req.user.id,
      type,
      title,
      message,
      relatedItem,
      relatedUser,
    })

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: { notification },
    })
  } catch (error) {
    console.error("Create notification error:", error)
    res.status(500).json({
      success: false,
      message: "Server error creating notification",
    })
  }
}

// @desc    Get notification stats
// @route   GET /api/notifications/stats
// @access  Private
const getNotificationStats = async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      { $match: { recipient: req.user._id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] },
          },
        },
      },
    ])

    const totalUnread = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    })

    res.json({
      success: true,
      data: {
        stats,
        totalUnread,
      },
    })
  } catch (error) {
    console.error("Get notification stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error fetching notification stats",
    })
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationStats,
}
