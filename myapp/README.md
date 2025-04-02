# Animal Detection Website

## Overview
The **Animal Detection Website** is a web application that utilizes machine learning to detect and recognize animals in images or videos. The system is designed to help monitor and prevent wildlife intrusion using AI-driven detection.

## Features
- **User Authentication**: Secure login system for users.
- **Animal Detection**: Uses YOLOv8 for real-time animal detection.
- **Image & Video Upload**: Users can upload images or videos for analysis.
- **Results Display**: Detected animals are highlighted with bounding boxes.
- **Database Integration**: Stores user queries and detection results in MongoDB.
- **Responsive UI**: Clean and easy-to-use frontend built with React.

## Tech Stack
### Frontend
- React.js
- TCSS
- Axios (for API requests)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Python (YOLOv8 for detection)

## Installation
### Prerequisites
Make sure you have the following installed:
- Node.js
- Python
- MongoDB
- Git

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/paluvaisaketh/AnimalDetectionWebsite_Clean.git
   cd AnimalDetectionWebsite_Clean
   ```
2. Set up the backend:
   ```sh
   cd backend
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file inside the `backend/` directory and add the required API keys and database credentials.
   
4. Start the backend server:
   ```sh
   node server.js
   ```
5. Set up the frontend:
   ```sh
   cd ../frontend
   npm install
   npm start
   ```

## Usage
- Sign in using your credentials.
- Upload an image or video containing animals.
- The system will analyze and highlight detected animals.
- View and manage past detections in your profile.

## Environment Variables
Make sure to define the following in your `.env` file:
```plaintext
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
TWILIO_API_KEY=<your_twilio_api_key>
```

## Contributing
Contributions are welcome! Feel free to submit a pull request or report issues.

## License
This project is licensed under the MIT License.

## Author
[**Paluvai Bhargav Saketh**](https://github.com/paluvaisaketh)

