const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Initial database schema & seed data
const initialData = {
  institutions: [
    {
      id: "inst-1",
      name: "Edward College of Engineering",
      code: "ECE-001",
      type: "Engineering College",
      university: "University of Mumbai",
      location: "Parel, Mumbai, Maharashtra",
      address: "Parel, Mumbai, Maharashtra, India",
      email: "admin@edward.edu",
      phone: "+91 90000 00000",
      website: "https://edward.edu",
      representative: "College Administrator",
      designation: "Institution Coordinator",
      password: "password123"
    },
    {
      id: "inst-2",
      name: "K J Somaiya Institute of Technology",
      code: "KJS-002",
      type: "Technology Institute",
      university: "Mumbai University",
      location: "Sion, Mumbai, Maharashtra",
      address: "Ayryan Village, Sion, Mumbai, Maharashtra, India",
      email: "admin@university.edu",
      phone: "+91 98888 88888",
      website: "https://university.edu",
      representative: "Tech Lead",
      designation: "Portal Coordinator",
      password: "password123"
    }
  ],
  students: [
    {
      id: "stud-1",
      name: "Student Representative",
      email: "student@university.edu",
      collegeName: "K J Somaiya Institute of Technology",
      collegeCode: "KJS-002",
      collegeAddress: "Ayryan Village, Sion, Mumbai, Maharashtra, India",
      studentId: "KJS-IT-2026",
      password: "password123"
    }
  ],
  requests: []
};

// Load database from file or create if missing
function loadDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const fileData = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(fileData);
    if (!parsed.students) {
      parsed.students = initialData.students;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
    return initialData;
  }
}

// Save current memory state to file
function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

const db = loadDatabase();

// Strict institutional email validator (blocks personal domains)
const isInstitutionalEmail = (email) => {
  const lower = (email || '').toLowerCase();
  const personalDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@icloud.com'];
  if (!lower.includes('@')) return false;
  return !personalDomains.some(domain => lower.endsWith(domain));
};

// --- COLLEGE AUTH ENDPOINTS ---
app.post('/api/auth/college-login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  if (!isInstitutionalEmail(email)) {
    return res.status(400).json({ success: false, message: "Personal email domains are blocked." });
  }

  const institution = db.institutions.find(i => i.email.toLowerCase() === email.toLowerCase());

  if (!institution) {
    return res.status(404).json({ 
      success: false, 
      needsRegistration: true,
      message: "Institution record not found in database. Please register your institution below." 
    });
  }

  if (institution.password !== password) {
    return res.status(401).json({ success: false, message: "Incorrect password." });
  }

  res.json({ success: true, message: "Login successful", institution });
});

app.post('/api/auth/college-register', (req, res) => {
  const { name, code, type, university, location, address, email, phone, website, representative, designation, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Required fields are missing." });
  }

  if (!isInstitutionalEmail(email)) {
    return res.status(400).json({ success: false, message: "Personal email domains are blocked." });
  }

  const existing = db.institutions.find(i => i.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: "Institution already registered. Please sign in." });
  }

  const newInstitution = {
    id: "inst-" + Date.now(),
    name: name.trim(),
    code: code ? code.trim() : "ORG-" + Math.floor(100 + Math.random() * 900),
    type: type || "Engineering College",
    university: university || "Affiliated University",
    location: location || "City, State",
    address: address || "Full Official Address",
    email: email.toLowerCase(),
    phone: phone || "+91 00000 00000",
    website: website || "https://institution.edu",
    representative: representative || "Administrator",
    designation: designation || "Coordinator",
    password
  };

  db.institutions.push(newInstitution);
  saveDatabase(db);

  res.json({ success: true, message: "Institution registered successfully", institution: newInstitution });
});

// --- STUDENT AUTH ENDPOINTS ---
app.post('/api/auth/student-login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  if (!isInstitutionalEmail(email)) {
    return res.status(400).json({ success: false, message: "Personal email domains are blocked. Use your student email." });
  }

  const student = db.students.find(s => s.email.toLowerCase() === email.toLowerCase());

  if (!student) {
    return res.status(404).json({ 
      success: false, 
      needsRegistration: true,
      message: "Student record not found in database. Please create an account below." 
    });
  }

  if (student.password !== password) {
    return res.status(401).json({ success: false, message: "Incorrect password." });
  }

  // Always sync with the latest admin-registered institution record (case-insensitive match)
  const matchedInstitution = db.institutions.find(
    i => i.name.toLowerCase().trim() === (student.collegeName || "").toLowerCase().trim()
  );

  if (matchedInstitution) {
    student.collegeName = matchedInstitution.name;
    student.collegeCode = matchedInstitution.code;
    student.collegeAddress = matchedInstitution.address;
    saveDatabase(db);
  }

  res.json({ success: true, message: "Login successful", student });
});

app.post('/api/auth/student-register', (req, res) => {
  const { name, email, password, collegeName, studentId } = req.body;

  if (!email || !password || !collegeName || !studentId) {
    return res.status(400).json({ success: false, message: "All required student fields must be filled." });
  }

  if (!isInstitutionalEmail(email)) {
    return res.status(400).json({ success: false, message: "Personal email domains are blocked." });
  }

  // Enforce that the institution must be registered by an admin first
  const matchedInstitution = db.institutions.find(
    i => i.name.toLowerCase().trim() === collegeName.toLowerCase().trim()
  );

  if (!matchedInstitution) {
    return res.status(400).json({ 
      success: false, 
      message: "Your college is not registered on OmniCampus yet. Please ask your college administrator to list your institution first." 
    });
  }

  const existing = db.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    // Update existing student record with matched institution details
    existing.collegeName = matchedInstitution.name;
    existing.collegeCode = matchedInstitution.code;
    existing.collegeAddress = matchedInstitution.address;
    saveDatabase(db);
    return res.json({ success: true, message: "Student account synced successfully", student: existing });
  }

  const newStudent = {
    id: "stud-" + Date.now(),
    name: name ? name.trim() : "Student User",
    email: email.toLowerCase(),
    collegeName: matchedInstitution.name,
    collegeCode: matchedInstitution.code,
    collegeAddress: matchedInstitution.address,
    studentId: studentId.trim(),
    password
  };

  db.students.push(newStudent);
  saveDatabase(db);

  res.json({ success: true, message: "Student account created successfully", student: newStudent });
});

// --- GENERAL APP ENDPOINTS ---
app.get('/api/institution/profile', (req, res) => {
  const { email } = req.query;
  const institution = db.institutions.find(i => i.email.toLowerCase() === (email || '').toLowerCase());
  if (!institution) {
    return res.status(404).json({ success: false, message: "Institution not found." });
  }
  res.json({ success: true, institution });
});

app.post('/api/requests', (req, res) => {
  const newRequest = {
    id: "req-" + Date.now(),
    ...req.body,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "New"
  };
  db.requests.unshift(newRequest);
  saveDatabase(db);

  res.json({ success: true, request: newRequest });
});

app.get('/api/requests', (req, res) => {
  res.json({ success: true, requests: db.requests });
});

app.listen(PORT, () => {
  console.log(`OmniCampus backend running on port ${PORT}`);
  console.log(`Persistent database stored at: ${DB_FILE}`);
});