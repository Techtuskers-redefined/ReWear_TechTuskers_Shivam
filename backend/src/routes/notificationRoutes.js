const express = require("express")
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationStats,
} = require("../controllers/notificationController")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

// Routes
router.get("/", protect, getNotifications)
router.get("/stats", protect, getNotificationStats)
router.put("/mark-all-read", protect, markAllAsRead)
router.put("/:id/read", protect, markAsRead)
router.delete("/:id", protect, deleteNotification)

// Admin only
router.post("/", protect, admin, createNotification)

module.exports = router
