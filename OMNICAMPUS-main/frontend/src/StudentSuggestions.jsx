import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { apiFetch } from "./api";
import "./StudentSuggestions.css";

export default function StudentSuggestions() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("Resource Shortage");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const collegeName = sessionStorage.getItem("collegeName") || "";
  const studentName = sessionStorage.getItem("studentName") || "Student";
  const studentEmail = sessionStorage.getItem("userEmail") || "";
  const studentId = sessionStorage.getItem("studentId") || "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!subject.trim() || !description.trim()) {
      setMessage("Error: Please fill in all fields.");
      return;
    }

    if (!collegeName || !studentEmail) {
      setMessage("Error: Student information is missing. Please log in again.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await apiFetch("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          title: subject.trim(),
          description: description.trim(),
          type: category,
          collegeName,
          author: studentName,
          email: studentEmail,
          collegeId: studentId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setSubject("");
      setDescription("");
      setCategory("Resource Shortage");

      setMessage(
        "Success: Your request has been sent successfully to your college administration!"
      );
    } catch (error) {
      console.error("Submission error:", error);
      setMessage(`Error: ${error.message || "Cannot connect to backend server."}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="student-suggestions-page"
      style={{ background: "#090d16", color: "#f1f5f9" }}
    >
      <header
        className="student-suggestions-header"
        style={{
          background: "rgba(9, 13, 22, 0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <button
          className="student-suggestions-logo"
          onClick={() => navigate("/student/home")}
          style={{ color: "#fff" }}
        >
          Omni<span>Campus</span>
        </button>

        <button
          className="student-suggestions-back"
          onClick={() => navigate("/student/home")}
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.1)",
            color: "#cbd5e1"
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </header>

      <main className="student-suggestions-main">
        <span
          className="student-suggestions-kicker"
          style={{ color: "#d4af37" }}
        >
          CAMPUS VOICE &amp; RESOURCES
        </span>

        <div className="student-suggestions-heading">
          <h1 style={{ color: "#fff" }}>
            Suggestions &amp; <em>Requests</em>
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Voice campus improvements, request facilities, or submit
            feedback directly to {collegeName} administration.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="student-suggestions-card"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.08)"
          }}
        >
          <div
            className="student-suggestions-icon"
            style={{
              background: "rgba(212,175,55,0.1)",
              color: "#d4af37"
            }}
          >
            <MessageSquare size={24} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#cbd5e1" }}>
              Request Category
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "9px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontFamily: "inherit"
              }}
            >
              <option value="Resource Shortage">Resource Shortage</option>
              <option value="Classroom Facilities">Classroom Facilities</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Campus Event">Campus Event Suggestion</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#cbd5e1" }}>Subject</label>

            <input
              type="text"
              placeholder="e.g. Additional library books needed"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              maxLength={120}
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "9px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontFamily: "inherit",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ color: "#cbd5e1" }}>Description</label>

            <textarea
              rows="5"
              placeholder="Provide clear details regarding your request..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "9px",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontFamily: "inherit",
                boxSizing: "border-box",
                resize: "vertical"
              }}
            />
          </div>

          <div className="student-suggestions-bottom">
            <span>
              Submitting as: <strong>{studentName}</strong> ({collegeName})
            </span>

            <button
              type="submit"
              disabled={submitting}
              style={{ background: "#d4af37", color: "#090d16" }}
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>

          {message && (
            <p
              className="student-suggestions-message"
              role="status"
              style={{
                color: message.startsWith("Error") ? "#fca5a5" : "#34d399",
                fontWeight: "600"
              }}
            >
              {message}
            </p>
          )}
        </form>
      </main>

      <footer
        className="student-suggestions-footer"
        style={{
          background: "rgba(9, 13, 22, 0.85)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          color: "#94a3b8"
        }}
      >
        <strong style={{ color: "#fff" }}>
          Omni<span>Campus</span>
        </strong>

        <span>© {new Date().getFullYear()} OmniCampus. All rights reserved.</span>
      </footer>
    </div>
  );
}