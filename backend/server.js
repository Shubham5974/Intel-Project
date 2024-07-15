const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint to upload files
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  // Call the ML model script with the uploaded file path
  const pythonScriptPath = path.join(__dirname, '..', 'intel', 'model.py');
  exec(`python "${pythonScriptPath}" "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the output of the ML model script back to the client
    res.json({ output: stdout });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
