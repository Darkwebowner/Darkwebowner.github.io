const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 80;

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const users = [{ email: 'owner@stronakapiego.pl', password: 'Bedrock120Ort' }];

// Serve the main HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', ".zip"];

    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Invalid file type'), false);
    }

    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.redirect(`/welcome?email=${email}`);
  } else {
    res.json({ success: false, message: 'Nieprawidłowe hasło' });
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  users.push({ email, password });
  res.redirect('/login');
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.send({ fileUrl });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
