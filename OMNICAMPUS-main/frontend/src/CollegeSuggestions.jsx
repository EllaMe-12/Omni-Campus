import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  X,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { apiFetch } from "./utils/api";
import "./CollegeSuggestions.css";

export default function CollegeSuggestions() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  const collegeName = sessionStorage.getItem("collegeName") || "";

  const fetchCollegeRequests = useCallback(async () => {
    if (!collegeName) {
      setMessage("Error: College information is missing. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await apiFetch(
        `/api/requests?college=${encodeURIComponent(collegeName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch requests.");
      }

      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetching requests failed:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [collegeName]);

  useEffect(() => {
    fetchCollegeRequests();
  }, [fetchCollegeRequests]);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    setMessage("");

    try {
      const response = await apiFetch(
        `/api/requests/${encodeURIComponent(id)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update request.");
      }

      setRequests((previous) =>
        previous.map((request) =>
          request.id === id ? { ...request, status: data.status } : request
        )
      );

      setMessage(`Request successfully marked as ${newStatus}.`);
    } catch (error) {
      console.error("Status update failed:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="college-suggestions-page">
      <header className="college-suggestions-header">
        <button
          className="college-suggestions-logo"
          onClick={() => navigate("/home")}
        >
          Omni<span>Campus</span>
        </button>

        <button
          className="college-suggestions-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </header>

      <main className="college-suggestions-main">
        <span className="college-suggestions-kicker">
          ADMINISTRATION PORTAL
        </span>

        <div className="college-suggestions-heading">
          <h1>
            Student Suggestions &amp; <em>Requests</em>
          </h1>

          <p>
            Review, evaluate, and manage facility or suggestion
            requests submitted by students of {collegeName || "your institution"}.
          </p>
        </div>

        <div className="college-suggestions-section-heading">
          <h2>Incoming Submissions ({requests.length})</h2>
          <span>{collegeName}</span>
        </div>

        <button
          type="button"
          onClick={fetchCollegeRequests}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
            padding: "9px 14px",
            border: "1px solid #dce4ef",
            borderRadius: "7px",
            background: "#fff",
            color: "#0b1d3a",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          <RefreshCw size={15} />
          Refresh Requests
        </button>

        {loading ? (
          <p style={{ color: "#64748b" }}>
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <div className="college-suggestions-empty">
            <MessageSquare size={32} />
            <h3>No student requests yet</h3>
            <p>
              When students submit feedback or resource requests
              from their portal, they will appear here for review.
            </p>
          </div>
        ) : (
          <div className="college-suggestions-list">
            {requests.map((req) => (
              <div
                key={req.id}
                className="college-suggestions-card"
              >
                <div className="college-suggestions-card-top">
                  <span className="college-suggestions-id">
                    {req.type || "Request"}
                  </span>

                  <span
                    className="college-suggestions-status"
                    style={{
                      background:
                        req.status === "Approved"
                          ? "#e4f6ef"
                          : req.status === "Rejected"
                            ? "#fce9e9"
                            : "#fff4df",
                      color:
                        req.status === "Approved"
                          ? "#198568"
                          : req.status === "Rejected"
                            ? "#b34b4b"
                            : "#a46a13"
                    }}
                  >
                    {req.status || "Pending"}
                  </span>
                </div>

                <h3
                  style={{
                    margin: "12px 0 8px",
                    fontSize: "17px",
                    color: "#0b1d3a"
                  }}
                >
                  {req.title}
                </h3>

                <p className="college-suggestions-text">
                  {req.description}
                </p>

                <div
                  className="college-suggestions-card-bottom"
                  style={{
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #e6eaf0"
                  }}
                >
                  <div>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>
                      Submitted by: <strong>{req.author || "Student"}</strong>
                    </p>

                    {req.email && (
                      <p style={{ fontSize: "12px", color: "#64748b" }}>
                        Email: {req.email}
                      </p>
                    )}

                    {req.collegeId && (
                      <p style={{ fontSize: "12px", color: "#64748b" }}>
                        Student ID: {req.collegeId}
                      </p>
                    )}

                    {req.createdAt && (
                      <p style={{ fontSize: "12px", color: "#64748b" }}>
                        Submitted: {new Date(req.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      disabled={updatingId === req.id || req.status === "Approved"}
                      onClick={() => handleUpdateStatus(req.id, "Approved")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "8px 14px",
                        background: "#e4f6ef",
                        color: "#198568",
                        border: "0",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        opacity: updatingId === req.id || req.status === "Approved" ? 0.5 : 1
                      }}
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </button>

                    <button
                      disabled={updatingId === req.id || req.status === "Rejected"}
                      onClick={() => handleUpdateStatus(req.id, "Rejected")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "8px 14px",
                        background: "#fce9e9",
                        color: "#b34b4b",
                        border: "0",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        opacity: updatingId === req.id || req.status === "Rejected" ? 0.5 : 1
                      }}
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && (
          <p
            role="status"
            style={{
              marginTop: "20px",
              color: message.startsWith("Error") ? "#b34b4b" : "#3568d4",
              fontSize: "13px",
              fontWeight: "700"
            }}
          >
            {message}
          </p>
        )}
      </main>

      <footer className="college-suggestions-footer">
        <strong>Omni<span>Campus</span></strong>
        <span>
          © {new Date().getFullYear()} OmniCampus Administration
        </span>
      </footer>
    </div>
  );
}