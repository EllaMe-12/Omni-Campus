const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = { institutions: [], requests: [], students: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return { institutions: [], requests: [], students: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// ---------------------------------------------------------
// DEMO ACCOUNTS
// Re-created on every server start if missing, so they survive
// hosts (like Render) that reset the filesystem on redeploy.
// ---------------------------------------------------------
const DEMO_COLLEGE = {
  id: 'inst-demo',
  name: 'OmniCampus Demo College',
  code: 'DEMO-001',
  type: 'Engineering College',
  university: 'University of Mumbai',
  location: 'Mumbai, Maharashtra',
  address: 'Mumbai, Maharashtra, India',
  email: 'demo.college@omnicampus.edu',
  phone: '+91 90000 00000',
  website: 'https://omnicampus.edu',
  representative: 'Demo Administrator',
  designation: 'Institution Coordinator',
  password: 'demo1234'
};

const DEMO_STUDENT = {
  id: 'stud-demo',
  name: 'Demo Student',
  email: 'demo.student@omnicampus.edu',
  collegeName: 'OmniCampus Demo College',
  collegeCode: 'DEMO-001',
  collegeAddress: 'Mumbai, Maharashtra, India',
  studentId: 'DEMO-2026',
  password: 'demo1234'
};

function seedDemoAccounts() {
  const db = readDatabase();
  let changed = false;

  if (!db.institutions.some((i) => (i.email || '').toLowerCase() === DEMO_COLLEGE.email)) {
    db.institutions.push({ ...DEMO_COLLEGE });
    changed = true;
  }
  if (!db.students.some((s) => (s.email || '').toLowerCase() === DEMO_STUDENT.email)) {
    db.students.push({ ...DEMO_STUDENT });
    changed = true;
  }

  if (changed) {
    writeDatabase(db);
    console.log('Demo accounts seeded.');
  }
}

seedDemoAccounts();

// ---------------------------------------------------------
// 1. UNIVERSAL COLLEGE VERIFICATION (Always returns success)
// ---------------------------------------------------------
app.post(['/api/auth/verify-college', '/api/auth/check-college', '/api/college/check'], (req, res) => {
  const { collegeName, college, email } = req.body;
  const targetName = (collegeName || college || (email ? email.split('@')[1] : 'Unknown College')).trim();
  const db = readDatabase();

  let institution = db.institutions.find(
    (inst) => inst.name.toLowerCase() === targetName.toLowerCase()
  );

  // Automatically add the college on-the-fly if missing so it never blocks
  if (!institution) {
    institution = {
      id: 'inst-' + Date.now(),
      name: targetName,
      code: 'AUTO-' + Math.floor(100 + Math.random() * 900),
      address: 'Main Campus',
      email: email || `admin@${targetName.toLowerCase().replace(/\s+/g, '')}.edu`,
      password: 'password123'
    };
    db.institutions.push(institution);
    writeDatabase(db);
  }

  return res.json({
    success: true,
    registered: true,
    message: 'College verified successfully.',
    institution
  });
});

// ---------------------------------------------------------
// 2. STUDENT LOGIN (Allows login without registered college checks)
// ---------------------------------------------------------
app.post('/api/auth/student-login', (req, res) => {
  const { email, password } = req.body;
  const db = readDatabase();
  const emailLower = (email || '').toLowerCase().trim();

  let student = db.students.find((s) => s.email.toLowerCase() === emailLower);

  // If user doesn't exist yet, auto-create account on-the-fly with provided credentials
  if (!student) {
    student = {
      id: 'stud-' + Date.now(),
      name: emailLower.split('@')[0] || 'User',
      email: emailLower,
      password: password || 'password123',
      collegeName: 'OmniCampus Institution',
      collegeCode: 'OMNI-01',
      collegeAddress: 'Main Campus',
      studentId: 'STD-' + Math.floor(1000 + Math.random() * 9000)
    };
    db.students.push(student);
    writeDatabase(db);
  } else if (student.password && student.password !== password) {
    return res.status(401).json({ message: 'Invalid password credentials.' });
  }

  res.json({
    message: 'Login successful',
    student: {
      name: student.name,
      email: student.email,
      collegeName: student.collegeName || 'OmniCampus Institution',
      collegeCode: student.collegeCode || 'OMNI-01',
      collegeAddress: student.collegeAddress || 'Main Campus',
      studentId: student.studentId || 'STD-001'
    }
  });
});

// ---------------------------------------------------------
// 3. STUDENT REGISTER (Registers any college name automatically)
// ---------------------------------------------------------
app.post('/api/auth/student-register', (req, res) => {
  const { name, email, password, collegeName, studentId } = req.body;
  const db = readDatabase();
  const emailLower = (email || '').toLowerCase().trim();

  let student = db.students.find((s) => s.email.toLowerCase() === emailLower);

  const finalCollegeName = collegeName && collegeName.trim() ? collegeName.trim() : 'OmniCampus Institution';

  let matchedInstitution = db.institutions.find(
    (inst) => inst.name.toLowerCase() === finalCollegeName.toLowerCase()
  );

  if (!matchedInstitution) {
    matchedInstitution = {
      id: 'inst-' + Date.now(),
      name: finalCollegeName,
      code: 'COLLEGE-' + Math.floor(100 + Math.random() * 900),
      address: 'Main Campus'
    };
    db.institutions.push(matchedInstitution);
  }

  if (!student) {
    student = {
      id: 'stud-' + Date.now(),
      name: name && name.trim() ? name.trim() : (emailLower.split('@')[0] || 'Student'),
      email: emailLower,
      password: password || 'password123',
      collegeName: matchedInstitution.name,
      collegeCode: matchedInstitution.code,
      collegeAddress: matchedInstitution.address || 'Main Campus',
      studentId: studentId || 'STD-' + Math.floor(1000 + Math.random() * 9000)
    };
    db.students.push(student);
  } else {
    student.collegeName = matchedInstitution.name;
    if (password) student.password = password;
  }

  writeDatabase(db);

  res.status(201).json({
    message: 'Registration successful',
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

// ---------------------------------------------------------
// 4. INSTITUTION REGISTRATION & LOGIN
// ---------------------------------------------------------
app.post('/api/auth/college-login', (req, res) => {
  const { email, password } = req.body;
  const db = readDatabase();
  const emailLower = (email || '').toLowerCase().trim();

  const institution = db.institutions.find(
    (inst) => (inst.email || '').toLowerCase() === emailLower && inst.password === password
  );

  if (!institution) {
    return res.status(401).json({ message: 'Invalid institutional credentials.' });
  }

  res.json({ message: 'Login successful', institution });
});

app.post('/api/auth/college-register', (req, res) => {
  const { name, email, password, code, address, phone, website, representative, designation } = req.body;
  const db = readDatabase();
  const emailLower = (email || '').toLowerCase().trim();

  let existing = db.institutions.find((inst) => (inst.email || '').toLowerCase() === emailLower);
  if (existing) {
    return res.status(400).json({ message: 'Institution with this email already registered.' });
  }

  const newInstitution = {
    id: 'inst-' + Date.now(),
    name,
    email: emailLower,
    password: password || 'password123',
    code: code || 'CODE-' + Math.floor(100 + Math.random() * 900),
    address: address || 'Main Campus',
    phone: phone || '',
    website: website || '',
    representative: representative || 'Administrator',
    designation: designation || 'Coordinator'
  };

  db.institutions.push(newInstitution);
  writeDatabase(db);

  res.status(201).json({ message: 'Registration successful', institution: newInstitution });
});

// ---------------------------------------------------------
// 5. REQUESTS API
// ---------------------------------------------------------
app.get('/api/requests', (req, res) => {
  const { college } = req.query;
  const db = readDatabase();
  if (college) {
    const filtered = db.requests.filter(
      (r) => (r.college || '').toLowerCase() === college.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(db.requests);
});

app.post('/api/requests', (req, res) => {
  const { title, description, type, collegeName, author, email, collegeId } = req.body;
  const db = readDatabase();

  const newReq = {
    id: 'req-' + Date.now(),
    title: title || '',
    description: description || '',
    type: type || 'Suggestion',
    college: collegeName || 'General Institution',
    author: author || 'Student',
    email: email || '',
    collegeId: collegeId || '',
    createdAt: new Date().toISOString(),
    status: 'Pending'
  };

  db.requests.push(newReq);
  writeDatabase(db);
  res.status(201).json(newReq);
});

app.listen(PORT, () => {
  console.log(`OmniCampus backend running on port ${PORT}`);
});