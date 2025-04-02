require('dotenv').config(); // Load environment variables
const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const { ObjectId } = require('mongodb');
const twilio = require('twilio');

// Use environment variables for Twilio credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Ensure the uploads directory exists
const UPLOAD_DIR = 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });

// Simulated in-memory storage for demonstration
let farmerData = {};

// Login endpoint
router.post('/api/login', (req, res) => {
  const { username, password, phoneNumber } = req.body;
  if (!username || !password || !phoneNumber) {
    return res.status(400).json({ message: 'Please fill out all fields.' });
  }

  farmerData = { username, password, phoneNumber };
  res.json({ message: 'Login successful' });
});

// Send alert endpoint
router.post('/api/send-alert', (req, res) => {
  const { animalDetected } = req.body;
  if (farmerData.phoneNumber) {
    client.messages.create({
      body: `Alert: ${animalDetected} detected on your farm!`,
      from: TWILIO_PHONE_NUMBER,
      to: farmerData.phoneNumber
    })
    .then((message) => res.json({ message: 'Alert sent successfully', messageId: message.sid }))
    .catch((error) => res.status(500).json({ message: 'Error sending alert', error }));
  } else {
    res.status(400).json({ message: 'No phone number on record for alerts' });
  }
});

// Detection endpoint
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = req.file.path;
  const pythonScriptPath = path.join(__dirname, '../yoloModel/detect_animal.py');
  const pythonExecutable = process.env.PYTHON_PATH || 'python';

  execFile(pythonExecutable, [pythonScriptPath, imagePath], async (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing Python script:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const result = stdout.trim();
    console.log('Detection result:', result);
    const isAnimalDetected = !result.includes("No animal detected");

    try {
      const db = req.app.locals.db;
      const detectionData = {
        imagePath: `/uploads/${req.file.filename}`,
        detectionResult: isAnimalDetected ? "Yes" : "No",
        timestamp: new Date(),
      };

      await db.collection('detections').insertOne(detectionData);

      if (isAnimalDetected) {
        await client.messages.create({
          body: `Alert: An animal has been detected on your farm!`,
          from: TWILIO_PHONE_NUMBER,
          to: farmerData.phoneNumber
        });
      }

      res.json({ message: 'Detection result saved', result });
    } catch (dbError) {
      console.error('Error saving to MongoDB:', dbError);
      res.status(500).json({ error: 'Error saving detection result to database' });
    }
  });
});

// Fetch detections from the database
router.get('/detections', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const detections = await db.collection('detections').find({
      detectionResult: { $regex: /^Yes$/i }
    }).toArray();
    res.json(detections);
  } catch (error) {
    console.error('Error fetching detections:', error);
    res.status(500).json({ error: 'Failed to fetch detections' });
  }
});

// Delete a detection by ID
router.delete('/detections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const result = await db.collection('detections').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Detection not found.' });
    }

    // Optionally delete the image file
    const imagePath = path.join(__dirname, `../uploads/${id}.jpg`);
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting image file:', err);
    });

    res.json({ message: 'Detection deleted successfully.' });
  } catch (error) {
    console.error('Error deleting detection:', error);
    res.status(500).json({ message: 'Error deleting detection.' });
  }
});

module.exports = router;
