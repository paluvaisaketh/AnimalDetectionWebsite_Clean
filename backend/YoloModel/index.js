const { spawn } = require('child_process');
const path = require('path');

function detectAnimal(imagePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'detect_animal.py');

    const pythonProcess = spawn('python', [scriptPath, imagePath]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (error) => {
      reject(`Error: ${error}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });
  });
}

module.exports = { detectAnimal };
