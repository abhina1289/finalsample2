const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "default_secret";

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { 
        id: savedUser._id, 
        username: savedUser.username, 
        email: savedUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '24h' });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile retrieved",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username: username.trim() },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

// Delete user account
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Account deletion failed", error: error.message });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      message: "Token is valid",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Token verification failed", error: error.message });
  }
};

// Get user list - NOW ACCESSIBLE TO ANY AUTHENTICATED USER
exports.userList = async (req, res) => {
  try {
    console.log('📋 Fetching user list for user:', req.user.username);
    
    const users = await User.find()
      .select('_id username email createdAt')
      .sort({ createdAt: -1 });
    
    console.log('✅ Found users:', users.length);
    
    res.status(200).json({
      message: "User list retrieved successfully",
      users,
      count: users.length
    });
  } catch (error) {
    console.error('❌ User list error:', error);
    res.status(500).json({ message: "Error fetching user list", error: error.message });
  }
};