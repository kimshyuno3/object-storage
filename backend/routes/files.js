
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const FILE_DB = path.join(__dirname, '../data/files.json');
const STORAGE_DIR = path.join(__dirname, '../storage');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR);

function loadFiles() {
  if (!fs.existsSync(FILE_DB)) return [];
  return JSON.parse(fs.readFileSync(FILE_DB));
}

function saveFiles(files) {
  fs.writeFileSync(FILE_DB, JSON.stringify(files, null, 2));
}

const storage = multer.diskStorage({
  destination: STORAGE_DIR,
  filename: (req, file, cb) => {
    const unique = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), (req, res) => {
  const file = req.file;
  const user = req.user.username;
  const files = loadFiles();
  const id = uuidv4();
  const linkId = uuidv4();

  files.push({
    id,
    filename: file.filename,
    originalName: file.originalname,
    owner: user,
    size: file.size,
    uploadTime: new Date().toISOString(),
    access: { type: 'private', password: null },
    linkId
  });

  saveFiles(files);
  res.json({ message: 'File uploaded', id, link: `/files/download/${linkId}` });
});

router.get('/', auth, (req, res) => {
  const files = loadFiles().filter(f => f.owner === req.user.username);
  res.json(files);
});

router.get('/:id', auth, (req, res) => {
  const file = loadFiles().find(f => f.id === req.params.id);
  if (!file || file.owner !== req.user.username) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(file);
});

router.put('/:id/permission', auth, (req, res) => {
  const { type, password } = req.body;
  const files = loadFiles();
  const file = files.find(f => f.id === req.params.id);
  if (!file || file.owner !== req.user.username) {
    return res.status(404).json({ message: 'Not found' });
  }

  file.access.type = type;
  file.access.password = password || null;
  saveFiles(files);
  res.json({ message: 'Permission updated' });
});

router.delete('/:id', auth, (req, res) => {
  let files = loadFiles();
  const file = files.find(f => f.id === req.params.id);
  if (!file || file.owner !== req.user.username) {
    return res.status(404).json({ message: 'Not found' });
  }

  const filepath = path.join(STORAGE_DIR, file.filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  files = files.filter(f => f.id !== req.params.id);
  saveFiles(files);
  res.json({ message: 'Deleted' });
});

router.get('/download/:linkId', (req, res) => {
  const files = loadFiles();
  const file = files.find(f => f.linkId === req.params.linkId);
  if (!file) return res.status(404).send('File not found');

  
if (file.access.type === 'private') {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Login required');
  
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // ✅ 소유자 본인만 접근 허용
    if (payload.username !== file.owner) {
      return res.status(403).send('Access denied');
    }
  } catch {
    return res.status(401).send('Invalid token');
  }
}
if (file.access.type === 'password') {
  const inputPassword = req.query.password;
  if (!inputPassword || file.access.password !== inputPassword) {
    return res.status(403).send('비밀번호가 일치하지 않습니다');
  }
}


  const filepath = path.join(STORAGE_DIR, file.filename);
  if (!fs.existsSync(filepath)) return res.status(404).send('File missing');

  const mime = require('mime');
  res.setHeader('Content-Type', mime.getType(filepath));
  res.setHeader('Content-Disposition', 'inline; filename="' + file.originalName + '"');
  res.sendFile(filepath);
});

module.exports = router;
