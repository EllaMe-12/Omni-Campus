const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all Vercel domains and preview URLs
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const DATA_DIR = process.env.RENDER_DISK_PATH || __dirname;
const DB_FILE = path.join(DATA_DIR, 'database.json');

function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = { institutions: [], students: [], requests: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { institutions: [], students: [], requests: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Student Login
app.post('/api/auth/student-login', (req, res) => {
  const { email, password } = req.body;
  const db = readDatabase();

  const student = db.students.find(
    (s) => s.email.toLowerCase() === (email || '').toLowerCase() && s.password === password
  );

  if (!student) {
    return res.status(401).json({ message: 'Invalid institutional email or password.' });
  }

  res.status(200).json({
    message: 'Login successful',
    student: {
      name: student.name,
      email: student.email,
      collegeName: student.collegeName,
      collegeCode: student.collegeCode,
      collegeAddress: student.collegeAddress,
      studentId: student.studentId
    }
  });
});

// Student Registration
app.post('/api/auth/student-register', (req, res) => {
  const { name, email, password, collegeName, studentId } = req.body;
  const db = readDatabase();

  const emailLower = (email || '').toLowerCase();

  const existingStudent = db.students.find((s) => s.email.toLowerCase() === emailLower);
  if (existingStudent) {
    return res.status(400).json({ message: 'A student account with this email already exists.' });
  }

  const matchedInstitution = db.institutions.find(
    (inst) => inst.name.toLowerCase() === (collegeName || '').toLowerCase()
  );

  if (!matchedInstitution) {
    return res.status(403).json({
      message: 'Your college is not registered on OmniCampus yet. Contact your campus administrator.'
    });
  }

  const newStudent = {
    id: Date.now().toString(),
    name,
    email: emailLower,
    password,
    collegeName: matchedInstitution.name,
    collegeCode: matchedInstitution.code,
    collegeAddress: matchedInstitution.address,
    studentId
  };

  db.students.push(newStudent);
  writeDatabase(db);

  res.status(201).json({
    message: 'Registration successful',
    student: {
      name: newStudent.name,
      email: newStudent.email,
      collegeName: newStudent.collegeName,
      collegeCode: newStudent.collegeCode,
      collegeAddress: newStudent.collegeAddress,
      studentId: newStudent.studentId
    }
  });
});

// Get Requests/Suggestions
app.get('/api/requests', (req, res) => {
  const db = readDatabase();
  const collegeFilter = req.query.college;
  
  let results = db.requests || [];
  if (collegeFilter) {
    results = results.filter(
      (r) => (r.collegeName || '').toLowerCase() === collegeFilter.toLowerCase()
    );
  }

  res.status(200).json(results);
});

// Create Request/Suggestion
app.post('/api/requests', (req, res) => {
  const db = readDatabase();
  if (!db.requests) db.requests = [];

  const newRequest = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  db.requests.push(newRequest);
  writeDatabase(db);

  res.status(201).json({ message: 'Submitted successfully', request: newRequest });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});