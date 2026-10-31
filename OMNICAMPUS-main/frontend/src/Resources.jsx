
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  Plus,
  Building2,
  MapPin,
} from "lucide-react";
import "./Resources.css";

export const sampleResources = [
  {
    id: 1,
    name: "Computer Laboratory",
    institution: "Northfield College of Engineering",
    category: "Laboratories",
    type: "Share",
    availability: "Available",
    image: "/images/resources/computer-lab.jpg",
    place: "Andheri, Mumbai, Maharashtra",
    pinCode: "400053",
    contact: "lab@example.edu",
    price: null,
    condition: "Good",
    quantity: 1,
    specifications:
      "30 desktop computers, internet connectivity, projector",
    description:
      "Computer laboratory suitable for workshops, training sessions and academic projects.",
    rules:
      "Prior approval and faculty supervision required.",
  },
  {
    id: 2,
    name: "Seminar Hall",
    institution: "Crestview Institute of Technology",
    category: "Infrastructure",
    type: "Rent",
    availability: "Available",
    image: "/images/resources/seminar-hall.jpg",
    place: "Powai, Mumbai, Maharashtra",
    pinCode: "400076",
    contact: "facilities@example.edu",
    price: 1500,
    priceUnit: "day",
    condition: "Good",
    quantity: 1,
    specifications:
      "Capacity: 120 seats, projector, microphone and sound system",
    description:
      "Seminar hall available for academic seminars, conferences and collaborative events.",
    rules:
      "Advance booking required. Institutional events only.",
  },
  {
    id: 3,
    name: "3D Printer",
    institution: "Westbridge Institute of Technology",
    category: "Equipment",
    type: "Rent",
    availability: "Available",
    image: "/images/resources/3d-printer.jpg",
    place: "Dadar, Mumbai, Maharashtra",
    pinCode: "400028",
    contact: "equipment@example.edu",
    price: 500,
    priceUnit: "day",
    condition: "Good",
    quantity: 1,
    specifications:
      "FDM printer, PLA-compatible, suitable for academic prototyping",
    description:
      "3D printer available for student projects, prototype development and research.",
    rules:
      "Equipment must be handled according to institutional guidelines.",
  },
  {
    id: 4,
    name: "Reference Books",
    institution: "Eastwood College of Engineering",
    category: "Library",
    type: "Donate",
    availability: "Available",
    image: "/images/resources/reference-books.jpg",
    place: "Matunga, Mumbai, Maharashtra",
    pinCode: "400019",
    contact: "library@example.edu",
    price: null,
    condition: "Good",
    quantity: 25,
    specifications:
      "Science, mathematics and engineering reference books",
    description:
      "Collection of academic reference books available for donation to another institution.",
    rules:
      "Collection arrangements must be confirmed with the institution.",
  },
];

export default function Resources() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const categories = [
    "All Categories",
    "Laboratories",
    "Infrastructure",
    "Equipment",
    "Library",
  ];

  const filteredResources = sampleResources.filter((resource) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      resource.name.toLowerCase().includes(term) ||
      resource.institution.toLowerCase().includes(term) ||
      resource.place.toLowerCase().includes(term);

    const matchesCategory =
      category === "All Categories" ||
      resource.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="res-page">

      {/* HEADER */}
      <header className="res-header">
        <div className="res-header-inner">
          <button
            className="res-logo"
            onClick={() => navigate("/home")}
          >
            OmniCampus.
          </button>

          <button
            className="res-back"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>
        </div>
      </header>

      <main className="res-main">

        {/* PAGE HEADING */}
        <div className="res-heading">
          <div>
            <span className="res-eyebrow">
              INTER-COLLEGE RESOURCE NETWORK
            </span>

            <h1>Explore Resources</h1>

            <p>
              Discover resources available for sharing, renting,
              selling and donating across institutions.
            </p>
          </div>

          <button
            className="res-primary"
            onClick={() =>
              document
                .getElementById("res-list")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Browse Resources
            <ArrowUpRight size={18} />
          </button>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="res-toolbar">
          <div className="res-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Search resources, colleges or places..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            className="res-filter"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* RESOURCE LISTINGS */}
        <section
          id="res-list"
          className="res-section"
        >
          <div className="res-section-heading">
            <div>
              <span className="res-eyebrow">
                AVAILABLE OPPORTUNITIES
              </span>

              <h2>Resource Listings</h2>
            </div>

            <span className="res-count">
              {filteredResources.length} resources
            </span>
          </div>

          <div className="res-grid">
            {filteredResources.map((resource) => (
              <button
                type="button"
                className="res-card res-card-clickable"
                key={resource.id}
                onClick={() =>
                  navigate(`/resources/${resource.id}`)
                }
              >
                <img
                  className="res-card-image"
                  src={resource.image}
                  alt={resource.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="res-card-content">
                  <span className="res-type">
                    {resource.type}
                  </span>

                  <h3>{resource.name}</h3>

                  <p className="res-institution">
                    <Building2 size={15} />
                    {resource.institution}
                  </p>

                  <p className="res-institution">
                    <MapPin size={15} />
                    {resource.place}
                  </p>

                  <div className="res-card-bottom">
                    <span className="res-availability">
                      <span className="res-availability-dot" />
                      {resource.availability}
                    </span>

                    <span className="res-category">
                      {resource.category}
                    </span>
                  </div>

                  <span className="res-view-details">
                    View Details
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* EMPTY SEARCH RESULT */}
          {filteredResources.length === 0 && (
            <div className="res-empty">
              No resources match your search.
            </div>
          )}
        </section>

        {/* ADD RESOURCE BANNER */}
        <div className="res-add-banner">
          <div>
            <span className="res-eyebrow">
              CONTRIBUTE TO THE NETWORK
            </span>

            <h2>Have a resource to share?</h2>

            <p>
              List your institution's resources and create new
              opportunities for collaboration.
            </p>
          </div>

          <button
            className="res-primary"
            onClick={() =>
              window.alert(
                "Add Resource form will be developed next."
              )
            }
          >
            <Plus size={18} />
            Add Resource
          </button>
        </div>

        {/* DEMONSTRATION NOTICE */}
        <p className="res-demo-note">
          Demonstration listings only. Institution names, contact
          addresses, locations and prices are illustrative.
        </p>

      </main>
    </div>
  );
}
