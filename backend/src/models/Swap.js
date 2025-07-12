const mongoose = require("mongoose")

const swapSchema = new mongoose.Schema(
  {
    // User who initiated the swap
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // User who receives the swap request
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Item offered by initiator
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    // Item requested by initiator
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    // Point difference (positive = initiator pays points, negative = recipient pays points)
    pointDifference: {
      type: Number,
      default: 0,
    },
    // Status of the swap
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    // Message from initiator
    message: {
      type: String,
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    // Counter offer from recipient (optional)
    counterOffer: {
      pointDifference: Number,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    // Timestamps for different stages
    initiatedAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: Date,
    completedAt: Date,
    // Cancellation reason
    cancellationReason: String,
    // Who cancelled (if applicable)
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for efficient queries
swapSchema.index({ initiator: 1, status: 1 })
swapSchema.index({ recipient: 1, status: 1 })
swapSchema.index({ offeredItem: 1 })
swapSchema.index({ requestedItem: 1 })
swapSchema.index({ status: 1, createdAt: -1 })

// Virtual for calculating total point value
swapSchema.virtual("totalPointValue").get(function () {
  return Math.abs(this.pointDifference)
})

// Method to check if swap is valid
swapSchema.methods.isValid = function () {
  return (
    this.offeredItem &&
    this.requestedItem &&
    this.initiator &&
    this.recipient &&
    this.initiator.toString() !== this.recipient.toString() &&
    this.offeredItem.toString() !== this.requestedItem.toString()
  )
}

// Method to calculate point difference
swapSchema.methods.calculatePointDifference = function (offeredItemValue, requestedItemValue) {
  return requestedItemValue - offeredItemValue
}

// Method to check if users have sufficient points
swapSchema.methods.checkPointSufficiency = async function () {
  const initiatorUser = await mongoose.model("User").findById(this.initiator)
  const recipientUser = await mongoose.model("User").findById(this.recipient)
  
  if (this.pointDifference > 0) {
    // Initiator needs to pay points
    return initiatorUser.points >= this.pointDifference
  } else if (this.pointDifference < 0) {
    // Recipient needs to pay points
    return recipientUser.points >= Math.abs(this.pointDifference)
  }
  
  return true // No points needed
}

module.exports = mongoose.model("Swap", swapSchema) 