import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css"; // Uses the shared professional login styling

// Demo account (created automatically by server.js on startup)
const DEMO_STUDENT = {
  email: "demo.student@omnicampus.edu",
  password: "demo1234",
};

const demoButtonStyle = {
  width: "100%",
  minHeight: "48px",
  marginTop: "10px",
  border: "1px dashed #3568d4",
  borderRadius: "8px",
  background: "#eff5ff",
  color: "#3568d4",
  fontSize: "13px",
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
};

export default function StudentLogin() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    collegeName: "",
    studentId: "",
    email: "",
    password: "",
    name: ""
  });
  const [message, setMessage] = useState("");

  // Shared by the normal form and the demo button
  const authenticate = async (payload, register = false) => {
    setMessage("");
    setLoading(true);

    const endpoint = register ? "/api/auth/student-register" : "/api/auth/student-login";
    const rawUrl = (import.meta.env.VITE_API_URL || "https://omni-campus-backend-e09d.onrender.com")
      .trim()
      .replace(/\/+$/, "");

    try {
      const res = await fetch(`${rawUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Error: " + (data.message || "Authentication failed."));
        return;
      }

      sessionStorage.setItem("studentName", data.student.name);
      sessionStorage.setItem("userEmail", data.student.email);
      sessionStorage.setItem("collegeName", data.student.collegeName);
      sessionStorage.setItem("studentId", data.student.studentId || payload.studentId || "");

      navigate("/student/home");
    } catch (err) {
      setMessage("Error: Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAuth = (e) => {
    e.preventDefault();
    authenticate(form, isRegistering);
  };

  const handleDemoLogin = () => authenticate(DEMO_STUDENT, false);

  return (
    <main className="oc-login-page">
      <div className="oc-login-shell">
        {/* Left Visual Image Panel */}
        <section className="oc-brand-panel">
          <div className="oc-brand-header">
            <span className="oc-brand-name">OmniCampus</span>
            <span className="oc-brand-edition">STUDENT NETWORK</span>
          </div>

          <div className="oc-brand-content">
            <div className="oc-section-index">
              <span className="oc-index-line" /> YOUR CAMPUS. YOUR COMMUNITY.
            </div>
            <h2>Learn together.<br /><em>Grow beyond boundaries.</em></h2>
            <p>Discover opportunities, connect with students across institutions, and build something extraordinary together.</p>
          </div>

          <div className="oc-brand-footer">
            <span>DISCOVER</span> <span className="oc-footer-dot" /> <span>CONNECT</span> <span className="oc-footer-dot" /> <span>GROW</span>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="oc-form-panel">
          <div className="oc-form-top">
            <span>STUDENT PORTAL</span>
            <span className="oc-secure-indicator">
              <span className="oc-secure-dot" /> VERIFIED ACCESS
            </span>
          </div>

          <div className="oc-form-content">
            <div className="oc-form-intro">
              <span className="oc-form-kicker">STUDENT WORKSPACE</span>
              <h1>{isRegistering ? <>Join <em>OmniCampus.</em></> : <>Welcome <em>back.</em></>}</h1>
              <p>{isRegistering ? "Enter your college and student credentials to register." : "Sign in to access your student portal and campus network."}</p>
            </div>

            <form onSubmit={handleStudentAuth} className="oc-login-form">
              {isRegistering && (
                <div className="oc-field">
                  <label>Full Name</label>
                  <div className="oc-input-container">
                    <input
                      type="text"
                      placeholder="e.g. Alex Smith"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="oc-field">
                <label>College Name</label>
                <div className="oc-input-container">
                  <input
                    type="text"
                    placeholder="e.g. K J Somaiya Institute of Technology"
                    value={form.collegeName}
                    onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                    required={isRegistering}
                  />
                </div>
              </div>

              {isRegistering && (
                <div className="oc-field">
                  <label>College ID Number / Roll Number</label>
                  <div className="oc-input-container">
                    <input
                      type="text"
                      placeholder="e.g. 11103421"
                      value={form.studentId}
                      onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="oc-field">
                <label>Institutional Email</label>
                <div className="oc-input-container">
                  <input
                    type="email"
                    placeholder="name@institution.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="oc-field">
                <label>Password</label>
                <div className="oc-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="oc-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="oc-signin-button" disabled={loading}>
                <span>{isRegistering ? "Create Student Account" : "Sign in to Student Portal"}</span>
                <span className="oc-button-arrow">→</span>
              </button>

              {/* One-click demo access */}
              {!isRegistering && (
                <button
                  type="button"
                  style={demoButtonStyle}
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Try demo account"}
                </button>
              )}

              {message && (
                <p className="oc-form-message" role="status">
                  {message}
                </p>
              )}
            </form>

            <div className="oc-register-section">
              {isRegistering ? (
                <p>
                  Already have an account?{" "}
                  <button type="button" className="oc-register-link" onClick={() => setIsRegistering(false)}>
                    Sign in ↗
                  </button>
                </p>
              ) : (
                <p>
                  New student?{" "}
                  <button type="button" className="oc-register-link" onClick={() => setIsRegistering(true)}>
                    Create account ↗
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="oc-form-footer">
            <span>© {new Date().getFullYear()} OmniCampus</span>
            <span>Built for students</span>
          </div>
        </section>
      </div>
    </main>
  );
}