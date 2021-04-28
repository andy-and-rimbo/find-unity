const app = require("./app");
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
//const connectDB = require('./db/index');

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

//Body parser
app.use(express.json());

// Enable cors
app.use(cors());
// Connect to database
//connectDB();

// // Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
// app.use('/api/v1/lessons', require('./routes/lessons.routes'));

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

