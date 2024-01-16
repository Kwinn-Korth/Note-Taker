// Import express module
const express = require('express');
const path = require('path');

// Create an instance of the express app
const app = express();

// Define the port
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

// Define routes for index.html and notes.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Listen for connection to server
app.listen(PORT, () => {
  console.log(`Live server running at http://localhost:${PORT} 🚀`);
});
