const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
require("dotenv").config()

const connectDB = require("./config/db")

// Route imports
const authRoutes = require("./routes/authRoutes")
const itemRoutes = require("./routes/itemRoutes")
const swapRoutes = require("./routes/swapRoutes")
const notificationRoutes = require("./routes/notificationRoutes")

// Connect to database
connectDB()

const app = express()

// CORS - More permissive for development (must come before other middleware)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
)

// Security middleware
app.use(helmet())

// Body parser middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ReWear API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/items", itemRoutes)
app.use("/api/swaps", swapRoutes)
app.use("/api/notifications", notificationRoutes)

// Admin routes
app.use("/api/admin", require("./routes/adminRoutes"))

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err)

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    })
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  })
})

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
  console.log(`🚀 ReWear API server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => {
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`)
  process.exit(1)
})

module.exports = app
