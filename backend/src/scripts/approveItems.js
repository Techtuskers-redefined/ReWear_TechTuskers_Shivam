const mongoose = require("mongoose")
const Item = require("../models/Item")
require("dotenv").config()

const approveAllItems = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to database")

    // Find all unapproved items
    const unapprovedItems = await Item.find({ isApproved: false })
    console.log(`Found ${unapprovedItems.length} unapproved items`)

    if (unapprovedItems.length === 0) {
      console.log("No unapproved items found")
      return
    }

    // Approve all items
    const result = await Item.updateMany(
      { isApproved: false },
      { 
        isApproved: true, 
        approvedAt: new Date(),
        status: "available"
      }
    )

    console.log(`Approved ${result.modifiedCount} items`)
    console.log("All items are now approved and visible globally!")

  } catch (error) {
    console.error("Error approving items:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from database")
  }
}

// Run the script
approveAllItems() 