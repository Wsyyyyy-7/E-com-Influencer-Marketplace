import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
let db;

async function initDatabase() {
  db = await open({
    filename: join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Create users table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userType TEXT NOT NULL,
      preference TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      wechatIns TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
}

// Initialize database on server start
initDatabase().catch(console.error);

// API Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { userType, preference, name, email, wechatIns } = req.body;

    // Validate required fields
    if (!userType || !preference || !name || !email || !wechatIns) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userType', 'preference', 'name', 'email', 'wechatIns']
      });
    }

    // Insert user into database
    const result = await db.run(
      `INSERT INTO users (userType, preference, name, email, wechatIns) 
       VALUES (?, ?, ?, ?, ?)`,
      [userType, preference, name, email, wechatIns]
    );

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      id: result.lastID
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ 
      error: 'Failed to save user data',
      message: error.message 
    });
  }
});

// Get all users (optional - for viewing registered users)
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users ORDER BY createdAt DESC');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
