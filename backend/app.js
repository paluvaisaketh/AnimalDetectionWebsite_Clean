const express = require('express');
const mongoose = require('mongoose');
const detectRoute = require('./routes/detect');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/detect', detectRoute);

app.listen(5000, () => console.log('Server running on port 5000'));
