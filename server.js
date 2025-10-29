require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir))

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DBCONNECT || 'mongodb://localhost:27017/budget_planner')
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1)
  }
}

connectDB()

// Import routes
const expenseRoutes = require('./routes/expenseRoutes')
const contactRoutes = require('./routes/contactRoutes')
const receiptRoutes = require('./routes/receiptRoutes')
const userRoutes = require('./routes/userRoutes')
const budgetRoutes = require('./routes/budgetRoutes');
// const demoRoutes= require('./routes/demoRoutes')

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Budget App API Server Running!',
    status: 'OK',
    endpoints: {
      expenses: '/api/expenses',
      contact: '/api/contact',
      receipts: '/api/receipts'
    }
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  })
})

// API Routes
app.use('/api/expenses',expenseRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/receipts', receiptRoutes)
app.use('/api/users', userRoutes) 
app.use('/api/budget',budgetRoutes);
// app.use('/api/demo',demoRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: err.message
    })
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: err.message
    })
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/expenses',
      'POST /api/expenses',
      'GET /api/contact',
      'POST /api/contact',
      'GET /api/receipts',
      'POST /api/receipts'
    ]
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📁 Uploads directory: ${uploadsDir}`)
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`)
})