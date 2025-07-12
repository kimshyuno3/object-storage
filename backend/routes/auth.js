
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../data/users.json');
const SECRET = process.env.JWT_SECRET || 'secret123';

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash: hash });
  saveUsers(users);
  res.json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: '사용자가 존재하지 않습니다' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
