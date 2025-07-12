const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an item title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "tops",
        "bottoms",
        "dresses",
        "outerwear",
        "shoes",
        "accessories",
        "activewear",
        "formal",
        "casual",
        "vintage",
      ],
    },
    size: {
      type: String,
      required: [true, "Please specify size"],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "One Size"],
    },
    condition: {
      type: String,
      required: [true, "Please specify condition"],
      enum: ["Like New", "Excellent", "Very Good", "Good", "Fair"],
    },
    gender: {
      type: String,
      enum: ["women", "men", "unisex"],
      default: "unisex",
    },
    brand: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "pending", "swapped", "removed"],
      default: "available",
    },
    pointValue: {
      type: Number,
      default: 50, // Default points value
    },
    swapPreferences: {
      type: String,
      maxlength: [500, "Swap preferences cannot be more than 500 characters"],
    },
    pendingSwaps: [
      {
        requester: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
        message: String,
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectionReason: String,
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
itemSchema.index({ title: "text", description: "text", tags: "text" })
itemSchema.index({ category: 1, status: 1 })
itemSchema.index({ owner: 1 })

// Calculate point value based on condition and category
itemSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("condition") || this.isModified("category")) {
    let basePoints = 50

    // Adjust based on condition
    switch (this.condition) {
      case "Like New":
        basePoints += 20
        break
      case "Excellent":
        basePoints += 15
        break
      case "Very Good":
        basePoints += 10
        break
      case "Good":
        basePoints += 5
        break
      case "Fair":
        basePoints += 0
        break
    }

    // Adjust based on category
    if (["outerwear", "formal", "shoes"].includes(this.category)) {
      basePoints += 10
    }

    this.pointValue = basePoints
  }
  next()
})

module.exports = mongoose.model("Item", itemSchema)
