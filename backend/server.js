
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/storage', express.static(path.join(__dirname, 'storage')));

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/', express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
