import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  GraduationCap,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  IdCard,
  Save,
} from "lucide-react";
import "./StudentProfile.css";

const STORAGE_KEY = "omnicampus_student_profile";

function getActiveProfile() {
  const sessionName = sessionStorage.getItem("studentName");
  const sessionCollege = sessionStorage.getItem("collegeName");
  const sessionEmail = sessionStorage.getItem("userEmail");
  const sessionCollegeCode = sessionStorage.getItem("collegeCode");
  const sessionCollegeAddress = sessionStorage.getItem("collegeAddress");
  const sessionStudentId = sessionStorage.getItem("studentId");

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    return {
      name: sessionName || saved?.name || "",
      college: sessionCollege || saved?.college || "",
      collegeCode: sessionCollegeCode || saved?.collegeCode || "N/A",
      collegeAddress: sessionCollegeAddress || saved?.collegeAddress || "Official Registered Address",
      studentId: sessionStudentId || saved?.studentId || "N/A",
      email: sessionEmail || saved?.email || "",
      phone: saved?.phone || "",
    };
  } catch {
    return {
      name: sessionName || "",
      college: sessionCollege || "",
      collegeCode: sessionCollegeCode || "N/A",
      collegeAddress: sessionCollegeAddress || "Official Registered Address",
      studentId: sessionStudentId || "N/A",
      email: sessionEmail || "",
      phone: "",
    };
  }
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getActiveProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getActiveProfile());
  }, []);

  const updateField = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
    setSaved(false);
  };

  const saveProfile = (event) => {
    event.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      sessionStorage.setItem("studentName", profile.name);
      sessionStorage.setItem("collegeName", profile.college);
      sessionStorage.setItem("userEmail", profile.email);
      setSaved(true);
    } catch {
      setSaved(false);
      alert("Unable to save your profile in this browser.");
    }
  };

  return (
    <div className="student-profile-page">
      <header className="student-profile-header">
        <button
          className="student-profile-logo"
          onClick={() => navigate("/student/home")}
        >
          OmniCampus<span>.</span>
        </button>

        <button
          className="student-profile-back"
          onClick={() => navigate("/student/home")}
        >
          <ArrowLeft size={17} />
          Back to Student Home
        </button>
      </header>

      <main className="student-profile-main">
        <span className="student-profile-eyebrow">
          STUDENT PORTAL / MY ACCOUNT
        </span>

        <h1>
          My <em>Account.</em>
        </h1>

        <p className="student-profile-description">
          View and update your student profile information and official campus linkage.
        </p>

        <section className="student-profile-card">
          <div className="student-profile-card-heading">
            <div className="student-profile-avatar">
              <UserRound size={30} />
            </div>

            <div>
              <h2>Student & Campus Details</h2>
              <p>Official details verified by institution administrator.</p>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="student-profile-fields">
              <div className="student-profile-field">
                <label htmlFor="student-profile-name">
                  <UserRound size={16} />
                  Full Name
                </label>
                <input
                  id="student-profile-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={profile.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  required
                />
              </div>

              {/* Corrected binding to profile.studentId */}
              <div className="student-profile-field">
                <label htmlFor="student-profile-id">
                  <IdCard size={16} />
                  Student Roll / ID Number
                </label>
                <input
                  id="student-profile-id"
                  type="text"
                  value={profile.studentId}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>

              {/* Corrected binding to profile.college */}
              <div className="student-profile-field">
                <label htmlFor="student-profile-college">
                  <GraduationCap size={16} />
                  Verified College Name
                </label>
                <input
                  id="student-profile-college"
                  type="text"
                  value={profile.college}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>

              {/* Corrected binding to profile.collegeCode */}
              <div className="student-profile-field">
                <label htmlFor="student-profile-code">
                  <BadgeCheck size={16} />
                  Institution Code
                </label>
                <input
                  id="student-profile-code"
                  type="text"
                  value={profile.collegeCode}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>

              {/* Corrected binding to profile.collegeAddress */}
              <div className="student-profile-field" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="student-profile-address">
                  <Building2 size={16} />
                  Official Campus Address
                </label>
                <input
                  id="student-profile-address"
                  type="text"
                  value={profile.collegeAddress}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>

              <div className="student-profile-field">
                <label htmlFor="student-profile-email">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  id="student-profile-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={profile.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  required
                />
              </div>

              <div className="student-profile-field">
                <label htmlFor="student-profile-phone">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  id="student-profile-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={profile.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="student-profile-actions">
              {saved && (
                <span className="student-profile-success" role="status">
                  Profile saved successfully!
                </span>
              )}

              <button type="submit" className="student-profile-save">
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="student-profile-footer">
        <span>OmniCampus.</span>
        <span>
          © {new Date().getFullYear()} OmniCampus
        </span>
      </footer>
    </div>
  );
}