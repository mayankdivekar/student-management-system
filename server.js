
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully!");
})
.catch((error) => {
    console.log("MongoDB Connection Error:", error);
});

app.get('/', (req, res) => {
    res.send("Student Management System API is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
