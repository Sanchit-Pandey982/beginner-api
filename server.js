require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;

// Import Routes
const taskRoutes = require('./routes/taskroutes');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Use Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/files', fileRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));