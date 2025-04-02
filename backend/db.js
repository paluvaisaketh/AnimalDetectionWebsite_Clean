// db.js
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI if needed
let db;

async function connectToDb() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  db = client.db('animal_detection'); // Set your database name here
  console.log("Connected to MongoDB");
}

function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

module.exports = { connectToDb, getDb };
