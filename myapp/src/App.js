import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './Login.js';

function App() {
  const [detections, setDetections] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  const handleLoginSuccess = (phoneNumber) => {
    setIsLoggedIn(true);
    setUserPhone(phoneNumber);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchDetections = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/detect/detections');
          setDetections(response.data);
        } catch (error) {
          console.error("Error fetching detection data:", error);
        }
      };
      fetchDetections();
    }
  }, [isLoggedIn]);

  //Your existing handleDelete and other functions here...
    const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/detect/detections/${id}`);
      setDetections(detections.filter(detection => detection._id !== id));
    } catch (error) {
      console.error("Error deleting detection:", error);
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header className="hero-section">
        <div className="header-content">
          <h1>Unlocking the Secrets of Wildlife Detection</h1>
          <p>Protect your crops with advanced animal detection technology.</p>
          <button onClick={() => setShowGallery(true)} className="view-images-button">
            View Images
          </button>
          <button onClick={() => setShowSolutions(true)} className="explore-solutions-button">
            Explore Solutions
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {/* Gallery Overlay */}
        {showGallery && (
          <div className="overlay">
            <div className="detection-gallery">
              {detections.length > 0 ? (
                detections.map((detection) => (
                  <div key={detection._id} className="detection-item">
                    <img src={`http://localhost:3000${detection.imagePath}`} alt="Detected Animal" className="detected-image" />
                    <div className="detection-info">
                      <p>Detected: {detection.detectionResult}</p>
                      <p>Timestamp: {new Date(detection.timestamp).toLocaleString()}</p>
                      <button onClick={() => handleDelete(detection._id)} className="delete-button">Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No animal detections found</p>
              )}
              <button onClick={() => setShowGallery(false)} className="close-overlay-button">Close</button>
            </div>
          </div>
        )}

        {/* Solutions Overlay */}
        {showSolutions && (
          <div className="overlay">
            <div className="solutions-gallery">
              <h2>Explore Solutions</h2>
              <div className="solution-item">
                <img src="path/to/animal1.jpg" alt="Animal 1" />
                <h3>Wild Boar</h3>
                <p>Install strong fences and use repellents to deter wild boars.</p>
              </div>
              <div className="solution-item">
                <img src="path/to/animal2.jpg" alt="Animal 2" />
                <h3>Elephants</h3>
                <p>Use barriers, alarms, and lights to prevent elephant entry.</p>
              </div>
              <button onClick={() => setShowSolutions(false)} className="close-overlay-button">Close</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
