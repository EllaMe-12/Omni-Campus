import CampusExplorer from './CampusExplorer';

// Dynamically fetch both the session's college name and address
const currentCollege = sessionStorage.getItem("collegeName") || "Target Institute";
const currentAddress = sessionStorage.getItem("collegeAddress") || "Panvel, Navi Mumbai, Maharashtra";

// Pass them into the explorer
<CampusExplorer 
  targetCollegeName={currentCollege} 
  targetAddress={currentAddress} 
/>

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Package,
  IndianRupee,
  Send,
  CheckCircle2,
} from "lucide-react";
import { sampleResources } from "./Resources.jsx";
import "./ResourceDetails.css";

export default function ResourceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const resource = sampleResources.find(
    (item) => item.id === Number(id)
  );

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const [form, setForm] = useState({
    institution: "",
    email: "",
    purpose: "",
    startDate: "",
    endDate: "",
    quantity: 1,
  });

  if (!resource) {
    return (
      <div className="rd-not-found">
        <h1>Resource not found</h1>
        <button onClick={() => navigate("/resources")}>
          Back to Resources
        </button>
      </div>
    );
  }

  const handleRequest = (event) => {
    event.preventDefault();

    if (
      resource.type === "Rent" &&
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      window.alert("End date must be on or after start date.");
      return;
    }

    const request = {
      id: Date.now(),
      resourceId: resource.id,
      resourceName: resource.name,
      ownerInstitution: resource.institution,
      requestingInstitution: form.institution.trim(),
      email: form.email.trim(),
      purpose: form.purpose.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      quantity: Number(form.quantity),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("omnicampus-resource-requests") || "[]"
      );

      const requests = Array.isArray(existing) ? existing : [];

      localStorage.setItem(
        "omnicampus-resource-requests",
        JSON.stringify([...requests, request])
      );

      setRequestSent(true);
      setShowRequestForm(false);
    } catch (error) {
      window.alert(
        "Unable to save your request in this browser. Please try again."
      );
    }
  };

  return (
    <div className="rd-page">
      <header className="rd-header">
        <div className="rd-header-inner">
          <button
            className="rd-logo"
            onClick={() => navigate("/home")}
          >
            OmniCampus.
          </button>
          <button
            className="rd-back"
            onClick={() => navigate("/resources")}
          >
            <ArrowLeft size={17} /> Back to Resources
          </button>
        </div>
      </header>

      <main className="rd-main">
        <div className="rd-top">
          <div>
            <span className="rd-eyebrow">
              RESOURCE DETAILS / {resource.category.toUpperCase()}
            </span>
            <h1>{resource.name}</h1>
            <p>{resource.description}</p>
          </div>
          <span className="rd-available">
            <span className="rd-green-dot" />
            {resource.availability}
          </span>
        </div>

        <div className="rd-layout">
          <div className="rd-left">
            <div className="rd-image-wrapper">
              <img
                src={resource.image}
                alt={resource.name}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <section className="rd-panel">
              <span className="rd-eyebrow">ABOUT THIS RESOURCE</span>
              <h2>Resource Information</h2>

              <div className="rd-detail-grid">
                <div>
                  <span>Category</span>
                  <strong>{resource.category}</strong>
                </div>
                <div>
                  <span>Listing Type</span>
                  <strong>{resource.type}</strong>
                </div>
                <div>
                  <span>Condition</span>
                  <strong>{resource.condition}</strong>
                </div>
                <div>
                  <span>Quantity Available</span>
                  <strong>{resource.quantity}</strong>
                </div>
              </div>

              <div className="rd-description">
                <h3>Specifications</h3>
                <p>{resource.specifications}</p>

                <h3>Usage Rules</h3>
                <p>{resource.rules}</p>
              </div>
            </section>

            <section className="rd-panel">
              <span className="rd-eyebrow">RESOURCE PROVIDER</span>
              <h2>Institution Information</h2>

              <div className="rd-institution-row">
                <Building2 size={19} />
                <div>
                  <span>College Name</span>
                  <strong>{resource.institution}</strong>
                </div>
              </div>

              <div className="rd-institution-row">
                <MapPin size={19} />
                <div>
                  <span>Place</span>
                  <strong>{resource.place}</strong>
                </div>
              </div>

              <div className="rd-institution-row">
                <Package size={19} />
                <div>
                  <span>PIN Code</span>
                  <strong>{resource.pinCode}</strong>
                </div>
              </div>

              <div className="rd-institution-row">
                <Mail size={19} />
                <div>
                  <span>Institutional Contact</span>
                  <strong>{resource.contact}</strong>
                </div>
              </div>
            </section>
          </div>

          <aside className="rd-right">
            <div className="rd-request-card">
              <span className="rd-eyebrow">RESOURCE AVAILABILITY</span>

              {resource.type === "Rent" || resource.type === "Sell" ? (
                <>
                  <div className="rd-price">
                    <IndianRupee size={25} />
                    <strong>
                      {resource.price?.toLocaleString("en-IN")}
                    </strong>
                    {resource.type === "Rent" && (
                      <span>/ {resource.priceUnit}</span>
                    )}
                  </div>
                  <p className="rd-price-label">
                    {resource.type === "Rent"
                      ? "Rental price"
                      : "Selling price"}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="rd-free">
                    {resource.type === "Donate"
                      ? "Free Donation"
                      : "Available for Sharing"}
                  </h2>
                  <p className="rd-price-label">
                    No listing price
                  </p>
                </>
              )}

              <div className="rd-request-divider" />

              <p className="rd-request-help">
                Interested in this resource? Submit a request
                with your institution's details.
              </p>

              {requestSent ? (
                <div className="rd-success">
                  <CheckCircle2 size={21} />
                  Request saved successfully as Pending.
                </div>
              ) : (
                <button
                  className="rd-primary"
                  onClick={() => setShowRequestForm(true)}
                  disabled={resource.availability !== "Available"}
                >
                  <Send size={17} />
                  Request Resource
                </button>
              )}

              <p className="rd-demo-label">
                Demo mode: requests are saved in this browser,
                not delivered to the provider college.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {showRequestForm && (
        <div
          className="rd-modal-overlay"
          onClick={() => setShowRequestForm(false)}
        >
          <div
            className="rd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rd-request-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rd-modal-heading">
              <div>
                <span className="rd-eyebrow">RESOURCE REQUEST</span>
                <h2 id="rd-request-title">Request {resource.name}</h2>
              </div>
              <button
                type="button"
                className="rd-close"
                onClick={() => setShowRequestForm(false)}
                aria-label="Close request form"
              >
                ×
              </button>
            </div>

            <form className="rd-form" onSubmit={handleRequest}>
              <label>
                Your Institution Name
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={form.institution}
                  onChange={(event) =>
                    setForm({ ...form, institution: event.target.value })
                  }
                  placeholder="Enter your college name"
                />
              </label>

              <label>
                Institutional Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="name@college.edu"
                />
              </label>

              <label>
                Purpose of Request
                <textarea
                  required
                  rows={3}
                  maxLength={1000}
                  value={form.purpose}
                  onChange={(event) =>
                    setForm({ ...form, purpose: event.target.value })
                  }
                  placeholder="Explain how your institution will use this resource"
                />
              </label>

              <label>
                Quantity Required
                <input
                  type="number"
                  min="1"
                  max={resource.quantity}
                  required
                  value={form.quantity}
                  onChange={(event) =>
                    setForm({ ...form, quantity: event.target.value })
                  }
                />
              </label>

              {resource.type === "Rent" && (
                <div className="rd-date-row">
                  <label>
                    Start Date
                    <input
                      type="date"
                      required
                      min={new Date().toLocaleDateString("en-CA")}
                      value={form.startDate}
                      onChange={(event) =>
                        setForm({ ...form, startDate: event.target.value })
                      }
                    />
                  </label>

                  <label>
                    End Date
                    <input
                      type="date"
                      required
                      min={
                        form.startDate ||
                        new Date().toLocaleDateString("en-CA")
                      }
                      value={form.endDate}
                      onChange={(event) =>
                        setForm({ ...form, endDate: event.target.value })
                      }
                    />
                  </label>
                </div>
              )}

              <button type="submit" className="rd-primary">
                <Send size={17} />
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
