const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Define routes for index.html and notes.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Serve the JS files from the assets directory
app.get('/assets/js/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assets', 'js', 'index.js'));
});

// API route to get notes
app.get('/api/notes', (req, res) => {
  const dbFilePath = path.join(__dirname, 'db.json');

  // Read the contents of db.json
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      // Parse the JSON data to get an array of notes
      const notes = JSON.parse(data);

      // Send the notes as a JSON response
      res.json(notes);
    } catch (parseError) {
      console.error('Error parsing db.json:', parseError);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});
// Add other routes as needed

app.listen(PORT, () => {
  console.log(`Live server running at http://localhost:${PORT} 🚀`);
});