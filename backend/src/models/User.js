const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    points: {
      type: Number,
      default: 100, // Starting points for new users
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    stats: {
      itemsListed: {
        type: Number,
        default: 0,
      },
      itemsSwapped: {
        type: Number,
        default: 0,
      },
      pointsEarned: {
        type: Number,
        default: 0,
      },
      pointsSpent: {
        type: Number,
        default: 0,
      },
    },
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        showEmail: {
          type: Boolean,
          default: false,
        },
        showLocation: {
          type: Boolean,
          default: true,
        },
      },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Update user stats
userSchema.methods.updateStats = async function (action, points = 0) {
  switch (action) {
    case "itemListed":
      this.stats.itemsListed += 1
      this.points += 10 // Reward for listing items
      this.stats.pointsEarned += 10
      break
    case "itemSwapped":
      this.stats.itemsSwapped += 1
      this.points += 20 // Reward for successful swap
      this.stats.pointsEarned += 20
      break
    case "pointsSpent":
      this.points -= points
      this.stats.pointsSpent += points
      break
  }
  await this.save()
}

module.exports = mongoose.model("User", userSchema)
