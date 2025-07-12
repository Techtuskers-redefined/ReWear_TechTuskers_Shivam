const express = require("express")
const { body } = require("express-validator")
const { 
  createSwap, 
  respondToSwap, 
  respondToCounterOffer,
  getSwapHistory, 
  getPendingSwaps,
  requestSwap, 
  respondToLegacySwap, 
  redeemWithPoints 
} = require("../controllers/swapController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

// Validation rules
const swapRequestValidation = [
  body("message").optional().isLength({ max: 500 }).withMessage("Message cannot be more than 500 characters"),
]

const swapResponseValidation = [
  body("action").isIn(["accept", "reject"]).withMessage("Action must be either accept or reject"),
]

const createSwapValidation = [
  body("offeredItemId").isMongoId().withMessage("Valid offered item ID is required"),
  body("requestedItemId").isMongoId().withMessage("Valid requested item ID is required"),
  body("message").optional().isLength({ max: 500 }).withMessage("Message cannot be more than 500 characters"),
]

const newSwapResponseValidation = [
  body("action").isIn(["accept", "reject", "counter"]).withMessage("Action must be accept, reject, or counter"),
  body("counterOffer.pointDifference").optional().isNumeric().withMessage("Point difference must be a number"),
  body("counterOffer.message").optional().isLength({ max: 500 }).withMessage("Counter offer message cannot be more than 500 characters"),
]

const counterResponseValidation = [
  body("action").isIn(["accept", "reject"]).withMessage("Action must be either accept or reject"),
]

// New item-to-item swap routes
router.post("/create", protect, createSwapValidation, createSwap)
router.put("/:swapId/respond", protect, newSwapResponseValidation, respondToSwap)
router.put("/:swapId/counter-response", protect, counterResponseValidation, respondToCounterOffer)
router.get("/pending", protect, getPendingSwaps)

// Legacy routes (for backward compatibility)
router.get("/history", protect, getSwapHistory)
router.post("/:itemId/request", protect, swapRequestValidation, requestSwap)
router.put("/:itemId/respond/:requestId", protect, swapResponseValidation, respondToLegacySwap)
router.post("/:itemId/redeem", protect, redeemWithPoints)

module.exports = router
