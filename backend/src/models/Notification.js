const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: [
        "swap_request",
        "swap_accepted",
        "swap_rejected",
        "item_liked",
        "item_approved",
        "item_rejected",
        "points_earned",
        "system",
        "welcome",
      ],
    },
    title: {
      type: String,
      required: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actionUrl: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 })
notificationSchema.index({ recipient: 1, isRead: 1 })

// Mark notification as read
notificationSchema.methods.markAsRead = async function () {
  this.isRead = true
  this.readAt = new Date()
  await this.save()
}

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
  const notification = await this.create(data)
  return notification.populate("sender", "name avatar")
}

module.exports = mongoose.model("Notification", notificationSchema)
