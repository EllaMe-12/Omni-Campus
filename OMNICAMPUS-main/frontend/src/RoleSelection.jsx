
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  GraduationCap,
} from "lucide-react";
import "./RoleSelection.css";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <main className="role-page">
      <div className="role-container">
        <div className="role-brand">
          <span className="role-logo">
            Omni<span>Campus</span>
            <span className="role-logo-dot">.</span>
          </span>

          <span className="role-kicker">
            ONE CONNECTED INSTITUTIONAL NETWORK
          </span>
        </div>

        <div className="role-heading">
          <h1>
            How will you join
            <br />
            <em>OmniCampus?</em>
          </h1>

          <p>
            Select your role to continue into a workspace
            designed for you.
          </p>
        </div>

        <div className="role-options">
          <button
            type="button"
            className="role-card"
            onClick={() => navigate("/college-login")}
          >
            <div className="role-icon">
              <Building2 size={31} strokeWidth={1.6} />
            </div>

            <span className="role-card-kicker">
              INSTITUTIONAL ACCESS
            </span>

            <h2>College Representative</h2>

            <p>
              Manage institutional resources, collaborate
              with other colleges, and track earnings.
            </p>

            <span className="role-card-action">
              Continue as Representative
              <ArrowRight size={18} />
            </span>
          </button>

          <button
            type="button"
            className="role-card"
            onClick={() => navigate("/student/login")}
          >
            <div className="role-icon">
              <GraduationCap size={33} strokeWidth={1.6} />
            </div>

            <span className="role-card-kicker">
              STUDENT ACCESS
            </span>

            <h2>Student</h2>

            <p>
              Explore learning resources, discover events,
              connect with students, and find opportunities.
            </p>

            <span className="role-card-action">
              Continue as Student
              <ArrowRight size={18} />
            </span>
          </button>
        </div>

        <footer className="role-footer">
          <span>CONNECT</span>
          <span className="role-footer-dot" />
          <span>SHARE</span>
          <span className="role-footer-dot" />
          <span>GROW</span>
        </footer>
      </div>
    </main>
  );
}
