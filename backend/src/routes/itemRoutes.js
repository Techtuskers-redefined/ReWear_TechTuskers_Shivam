const express = require("express")
const { body } = require("express-validator")
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  toggleLike,
  getMyItems,
} = require("../controllers/itemController")
const { protect } = require("../middleware/authMiddleware")
const { upload } = require("../config/cloudinary")

const router = express.Router()

// Validation rules
const itemValidation = [
  body("title").trim().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category")
    .notEmpty()
    .withMessage("Category is required"),
  body("size")
    .notEmpty()
    .withMessage("Size is required"),
  body("condition")
    .notEmpty()
    .withMessage("Condition is required"),
]

// Routes
router.route("/").get(getItems).post(protect, upload.array("images", 5), itemValidation, createItem)

router.get("/my-items", protect, getMyItems)

router.post("/:id/like", protect, toggleLike)

router.route("/:id").get(getItem).put(protect, updateItem).delete(protect, deleteItem)

module.exports = router
