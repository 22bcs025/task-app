const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

const SECRET = process.env.JWT_SECRET || 'dev-secret'; /* Not secure but it's okay for development */
const router = express.Router();

/** POST /auth/register - hashes password and creates a new user. */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hash);
    res.status(201).json({ message: 'Registered successfully' });
  } catch {
    res.status(409).json({ error: 'Username already taken' });
  }
});

/** POST /auth/login - verifies hashed password and returns a JWT. */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: jwt.sign({ username }, SECRET, { expiresIn: '1h' }) });
});

/** Middleware that validates the Bearer token on protected routes. */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { router, authenticate };
