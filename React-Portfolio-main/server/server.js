import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';
import { projects } from '../client/src/lib/projectsData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// GET /api/projects - Serves the projects list
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// POST /api/contact - Handles contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Simple validation
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!email || !email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!message || !message.trim() || message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters long' });
  }

  const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
  db.run(query, [name.trim(), email.trim(), message.trim()], function (err) {
    if (err) {
      console.error('Error inserting message:', err.message);
      return res.status(500).json({ error: 'Failed to save message' });
    }
    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      id: this.lastID
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
