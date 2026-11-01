import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import "./StudentLogin.css";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [form, setForm] = useState({
    name: "",
    email: "",
    collegeName: "",
    collegeId: "",
    password: "",
  });

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setMessage("");
  };

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 12,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const emailLower = (form.email || "").toLowerCase();
    const personalDomains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com", "@icloud.com"];
    if (personalDomains.some((domain) => emailLower.endsWith(domain))) {
      setMessage("Error: Personal email addresses (like @gmail.com) are blocked. Use your institutional email.");
      return;
    }

    // Explicit fallback to Render live backend URL if environment variable is undefined
    const baseBackendUrl = import.meta.env.VITE_API_URL || "https://omni-campus-backend.onrender.com";
    const rawUrl = baseBackendUrl.trim().replace(/\/+$/, "");
    const endpoint = mode === "login" 
      ? `${rawUrl}/api/auth/student-login` 
      : `${rawUrl}/api/auth/student-register`;
      
    try {
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            collegeName: form.collegeName,
            studentId: form.collegeId
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage("Error: " + data.message);
        return;
      }

      localStorage.removeItem("omnicampus_student_profile");

      const student = data.student;
      sessionStorage.setItem("studentName", student.name || "");
      sessionStorage.setItem("userEmail", student.email || "");
      sessionStorage.setItem("collegeName", student.collegeName || "");
      sessionStorage.setItem("collegeCode", student.collegeCode || "");
      sessionStorage.setItem("collegeAddress", student.collegeAddress || "");
      sessionStorage.setItem("studentId", student.studentId || "");

      navigate("/student/home");
    } catch (err) {
      setMessage("Error: Cannot connect to backend server.");
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setShowPassword(false);
    setMessage("");
  };

  return (
    <main className="student-auth-page">
      <div className="student-auth-shell">
        <section
          className="student-brand-panel"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        >
          <div className="student-brand-header">
            <span className="student-brand-name">OmniCampus</span>
            <span className="student-brand-edition">STUDENT NETWORK</span>
          </div>

          <div
            className="student-visual"
            style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 500 360" className="student-network" fill="none">
              <path d="M48 205 L160 105 L288 165 L420 68" className="student-network-line" />
              <path d="M48 205 L175 280 L288 165 L445 280" className="student-network-line" />
              <path d="M160 105 L175 280" className="student-network-line student-network-secondary" />
              <path d="M288 165 L445 280 L420 68" className="student-network-line student-network-secondary" />
              {[[48, 205], [160, 105], [175, 280], [420, 68], [445, 280]].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" className="student-node" />
              ))}
              <circle cx="288" cy="165" r="29" className="student-center-ring" />
              <circle cx="288" cy="165" r="7" className="student-center-node" />
            </svg>
          </div>

          <div className="student-brand-content">
            <div className="student-section-index">
              <span className="student-index-line" />
              YOUR CAMPUS. YOUR COMMUNITY.
            </div>
            <h2>Learn together.<br /><em>Grow beyond boundaries.</em></h2>
            <p>Discover opportunities, connect with students across institutions, and build something extraordinary together.</p>
          </div>

          <div className="student-brand-footer">
            <span>DISCOVER</span>
            <span className="student-footer-dot" />
            <span>CONNECT</span>
            <span className="student-footer-dot" />
            <span>GROW</span>
          </div>
        </section>

        <section className="student-form-panel">
          <div className="student-form-top">
            <button type="button" className="student-back-button" onClick={() => navigate("/choose-role")}>
              <ArrowLeft size={16} /> Back
            </button>
            <span className="student-secure-indicator">
              <span className="student-secure-dot" /> STUDENT ACCESS
            </span>
          </div>

          <div className="student-form-content">
            <div className="student-form-intro">
              <div className="student-form-kicker">
                <GraduationCap size={17} /> YOUR STUDENT WORKSPACE
              </div>
              <h1>{mode === "login" ? <>Welcome <em>back.</em></> : <>Join <em>OmniCampus.</em></>}</h1>
              <p>{mode === "login" ? "Sign in to explore opportunities beyond your campus." : "Create your student profile and connect with your college network."}</p>
            </div>

            <div className="student-auth-tabs">
              <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Sign In</button>
              <button type="button" className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Register</button>
            </div>

            <form className="student-login-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <>
                  <div className="student-field">
                    <label htmlFor="student-name">Full Name</label>
                    <input
                      id="student-name"
                      type="text"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      required
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="student-college-name">College Name</label>
                    <input
                      id="student-college-name"
                      type="text"
                      placeholder="e.g. K J Somaiya Institute of Technology"
                      value={form.collegeName}
                      onChange={(event) => updateField("collegeName", event.target.value)}
                      required
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="student-college-id">College ID Number / Roll Number</label>
                    <input
                      id="student-college-id"
                      type="text"
                      placeholder="e.g. D-32"
                      value={form.collegeId}
                      onChange={(event) => updateField("collegeId", event.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="student-field">
                <label htmlFor="student-email">Institutional Email</label>
                <input
                  id="student-email"
                  type="email"
                  placeholder="student@institution.edu"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
              </div>

              <div className="student-field">
                <div className="student-field-heading">
                  <label htmlFor="student-password">Password</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="student-text-button"
                      onClick={() => setMessage("Password recovery will be available when authentication is connected.")}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="student-password-wrap">
                  <input
                    id="student-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "register" ? "Create a password (min. 6 characters)" : "Enter your password"}
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    minLength={6}
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="student-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="student-signin-button">
                <span>{mode === "login" ? "Sign in as Student" : "Create Student Account"}</span>
                <ArrowRight size={19} />
              </button>

              {message && (
                <p className="student-form-message" role="status" style={{ color: message.startsWith("Error") ? "#ef4444" : "#059669" }}>
                  {message}
                </p>
              )}
            </form>

            <div className="student-register-section">
              {mode === "login" ? (
                <p>New to OmniCampus? <button type="button" onClick={() => switchMode("register")}>Create an account</button></p>
              ) : (
                <p>Already registered? <button type="button" onClick={() => switchMode("login")}>Sign in</button></p>
              )}
            </div>
          </div>

          <div className="student-form-footer">
            <span>© {new Date().getFullYear()} OmniCampus</span>
            <span>Built for connected students</span>
          </div>
        </section>
      </div>
    </main>
  );
}