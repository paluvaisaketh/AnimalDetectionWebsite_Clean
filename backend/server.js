const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const detectRoute = require('./routes/animalDetection');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = 3000;

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

MongoClient.connect('mongodb://localhost:27017/animal_detection', { useUnifiedTopology: true })
  .then(client => {
    console.log("Connected to MongoDB");
    app.locals.db = client.db();  // Store database instance in app.locals.db

    // Use detect route
    app.use('/api/detect', detectRoute);

    // Start the server only after MongoDB is connected
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error("Error connecting to MongoDB:", error));
