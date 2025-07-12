const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Item = require("../models/Item")
const Notification = require("../models/Notification")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB Connected")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Item.deleteMany({})
    await Notification.deleteMany({})

    console.log("🗑️  Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await User.create({
      name: "Admin User",
      email: "admin@rewear.com",
      password: adminPassword,
      isAdmin: true,
      points: 1000,
      bio: "Platform administrator",
      location: {
        city: "San Francisco",
        state: "CA",
        country: "USA",
      },
    })

    // Create sample users
    const users = []
    const userPassword = await bcrypt.hash("password123", 10)

    const sampleUsers = [
      {
        name: "Emma Johnson",
        email: "emma@example.com",
        bio: "Fashion enthusiast and sustainability advocate",
        location: { city: "New York", state: "NY", country: "USA" },
      },
      {
        name: "Alex Chen",
        email: "alex@example.com",
        bio: "Vintage clothing collector",
        location: { city: "Los Angeles", state: "CA", country: "USA" },
      },
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        bio: "Minimalist wardrobe enthusiast",
        location: { city: "Chicago", state: "IL", country: "USA" },
      },
    ]

    for (const userData of sampleUsers) {
      const user = await User.create({
        ...userData,
        password: userPassword,
        points: Math.floor(Math.random() * 200) + 50,
      })
      users.push(user)
    }

    console.log("👥 Created sample users")

    // Create sample items
    const sampleItems = [
      {
        title: "Vintage Denim Jacket",
        description: "Classic blue denim jacket from the 90s. Perfect condition with minimal wear.",
        category: "outerwear",
        size: "M",
        condition: "Excellent",
        gender: "unisex",
        brand: "Levi's",
        color: "Blue",
        material: "Denim",
        tags: ["vintage", "denim", "jacket", "90s"],
        owner: users[0]._id,
        isApproved: true,
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        title: "Floral Summer Dress",
        description: "Beautiful floral print dress perfect for summer occasions.",
        category: "dresses",
        size: "S",
        condition: "Like New",
        gender: "women",
        brand: "Zara",
        color: "Floral",
        material: "Cotton",
        tags: ["summer", "floral", "dress", "casual"],
        owner: users[1]._id,
        isApproved: true,
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        title: "Black Leather Boots",
        description: "Stylish black leather ankle boots. Comfortable and versatile.",
        category: "shoes",
        size: "8",
        condition: "Very Good",
        gender: "women",
        brand: "Dr. Martens",
        color: "Black",
        material: "Leather",
        tags: ["boots", "leather", "black", "ankle"],
        owner: users[2]._id,
        isApproved: true,
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        title: "Wool Sweater",
        description: "Cozy wool sweater in cream color. Perfect for fall and winter.",
        category: "tops",
        size: "L",
        condition: "Good",
        gender: "unisex",
        brand: "H&M",
        color: "Cream",
        material: "Wool",
        tags: ["sweater", "wool", "cozy", "winter"],
        owner: users[0]._id,
        isApproved: false, // Pending approval
      },
    ]

    for (const itemData of sampleItems) {
      await Item.create(itemData)
    }

    console.log("👕 Created sample items")

    // Create sample notifications
    const notifications = [
      {
        recipient: users[0]._id,
        type: "welcome",
        title: "Welcome to ReWear!",
        message: "Welcome to our sustainable clothing exchange community!",
      },
      {
        recipient: users[1]._id,
        sender: admin._id,
        type: "item_approved",
        title: "Item approved!",
        message: "Your item 'Floral Summer Dress' has been approved and is now live",
      },
    ]

    for (const notificationData of notifications) {
      await Notification.create(notificationData)
    }

    console.log("🔔 Created sample notifications")

    console.log("✅ Database seeded successfully!")
    console.log("\n📧 Login credentials:")
    console.log("Admin: admin@rewear.com / admin123")
    console.log("User: emma@example.com / password123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

const runSeed = async () => {
  await connectDB()
  await seedData()
}

runSeed()