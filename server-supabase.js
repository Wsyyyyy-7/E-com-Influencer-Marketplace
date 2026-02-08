import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup
// Use service_role key for backend (bypasses RLS) or anon key for client-side
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) in your .env file');
  process.exit(1);
}

if (process.env.SUPABASE_SERVICE_KEY) {
  console.log('Using service_role key (bypasses RLS)');
} else {
  console.log('Using anon key (requires RLS policy)');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database table (run this once via Supabase SQL editor)
// Or create it programmatically:
async function initDatabase() {
  try {
    // Check if table exists by trying to query it
    const { error } = await supabase.from('users').select('id').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('Table does not exist. Please create it in Supabase SQL Editor:');
      console.log(`
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  userType TEXT NOT NULL,
  preference TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  wechatIns TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    } else {
      console.log('Database connection successful');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize on server start
initDatabase();

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

    // Insert user into Supabase
    // Note: Column names must match exactly (case-sensitive if created with quotes)
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          userType: userType,  // or "userType" if table uses quoted names
          preference: preference,
          name: name,
          email: email,
          wechatIns: wechatIns  // or "wechatIns" if table uses quoted names
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      id: data[0].id
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ success: true, users: data });
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
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: 'Supabase'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Using Supabase database: ${supabaseUrl}`);
});
