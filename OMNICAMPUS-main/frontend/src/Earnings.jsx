
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  ShoppingBag,
  CalendarDays,
  ReceiptText,
  IndianRupee,
  Search,
  CheckCircle2,
  Building2,
} from "lucide-react";
import "./Earnings.css";

// Demonstration transactions.
// Replace with completed transactions from the backend later.
const demoTransactions = [
  {
    id: "TXN-1001",
    resource: "Seminar Hall",
    institution: "Crestview Institute of Technology",
    type: "Rent",
    date: "2026-06-12",
    amount: 1500,
    status: "Completed",
  },
  {
    id: "TXN-1002",
    resource: "3D Printer",
    institution: "Westbridge Institute of Technology",
    type: "Rent",
    date: "2026-07-08",
    amount: 500,
    status: "Completed",
  },
  {
    id: "TXN-1003",
    resource: "Laboratory Equipment",
    institution: "Edward College of Engineering",
    type: "Sell",
    date: "2026-08-15",
    amount: 8500,
    status: "Completed",
  },
  {
    id: "TXN-1004",
    resource: "Projector",
    institution: "Edward College of Engineering",
    type: "Rent",
    date: "2026-09-05",
    amount: 1200,
    status: "Completed",
  },
  {
    id: "TXN-1005",
    resource: "Networking Equipment",
    institution: "Edward College of Engineering",
    type: "Sell",
    date: "2026-10-10",
    amount: 6500,
    status: "Completed",
  },
  {
    id: "TXN-1006",
    resource: "Conference Room",
    institution: "Edward College of Engineering",
    type: "Rent",
    date: "2026-10-20",
    amount: 2000,
    status: "Pending",
  },
];

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getCurrentCollege() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("omnicampus-college-profile") || "{}"
    );

    return (
      saved.name ||
      saved.institutionName ||
      "Edward College of Engineering"
    );
  } catch {
    return "Edward College of Engineering";
  }
}

export default function Earnings() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Transactions");

  const currentCollege = getCurrentCollege();

  // This is a demonstration page. Only show sample transactions
  // belonging to the selected college.
  const collegeTransactions = demoTransactions.filter(
    (transaction) => transaction.institution === currentCollege
  );

  const completedTransactions = collegeTransactions.filter(
    (transaction) => transaction.status === "Completed"
  );

  const rentalEarnings = completedTransactions
    .filter((transaction) => transaction.type === "Rent")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const salesEarnings = completedTransactions
    .filter((transaction) => transaction.type === "Sell")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalEarnings = rentalEarnings + salesEarnings;

  const filteredTransactions = collegeTransactions.filter(
    (transaction) => {
      const term = search.toLowerCase().trim();

      const matchesSearch =
        transaction.resource.toLowerCase().includes(term) ||
        transaction.id.toLowerCase().includes(term);

      const matchesFilter =
        filter === "All Transactions" ||
        (filter === "Rentals" && transaction.type === "Rent") ||
        (filter === "Sales" && transaction.type === "Sell");

      return matchesSearch && matchesFilter;
    }
  );

  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const transactions = completedTransactions.filter(
        (transaction) => {
          const date = new Date(`${transaction.date}T00:00:00`);
          return (
            date.getFullYear() === currentYear &&
            date.getMonth() === index
          );
        }
      );

      return {
        month,
        rentals: transactions
          .filter((transaction) => transaction.type === "Rent")
          .reduce((sum, transaction) => sum + transaction.amount, 0),
        sales: transactions
          .filter((transaction) => transaction.type === "Sell")
          .reduce((sum, transaction) => sum + transaction.amount, 0),
      };
    });
  }, [completedTransactions]);

  const maxMonthlyValue = Math.max(
    1,
    ...monthlyData.map((item) => item.rentals + item.sales)
  );

  const summaryCards = [
    {
      title: "Total Earnings",
      amount: currency(totalEarnings),
      icon: Wallet,
      description: "Income from completed transactions",
      className: "total",
    },
    {
      title: "Rental Earnings",
      amount: currency(rentalEarnings),
      icon: CalendarDays,
      description: "Income from renting resources",
      className: "rent",
    },
    {
      title: "Sales Earnings",
      amount: currency(salesEarnings),
      icon: ShoppingBag,
      description: "Income from selling resources",
      className: "sales",
    },
    {
      title: "Completed Transactions",
      amount: completedTransactions.length.toString(),
      icon: CheckCircle2,
      description: "Successfully completed transactions",
      className: "transactions",
    },
  ];

  return (
    <div className="earn-page">
      {/* HEADER */}
      <header className="earn-header">
        <div className="earn-header-inner">
          <button
            className="earn-logo"
            onClick={() => navigate("/home")}
          >
            Omni<span>Campus</span>.
          </button>

          <button
            className="earn-back"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>
        </div>
      </header>

      <main className="earn-main">
        {/* PAGE HEADING */}
        <div className="earn-heading">
          <div>
            <span className="earn-eyebrow">
              OMNICAMPUS FINANCIAL OVERVIEW
            </span>

            <h1>College Earnings</h1>

            <p>
              Track the income your institution generates through
              resource rentals and sales.
            </p>
          </div>

          <div className="earn-heading-icon">
            <IndianRupee size={28} />
          </div>
        </div>

        {/* COLLEGE INFORMATION */}
        <section className="earn-hero">
          <div className="earn-hero-icon">
            <Building2 size={30} />
          </div>

          <div>
            <span>INSTITUTION EARNINGS DASHBOARD</span>
            <h2>{currentCollege}</h2>
            <p>
              A complete overview of your institution's
              resource-based income.
            </p>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="earn-summary-section">
          <div className="earn-section-heading">
            <div>
              <h2>Earnings Summary</h2>
              <p>
                Revenue generated from completed transactions.
              </p>
            </div>
          </div>

          <div className="earn-summary-grid">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  className={`earn-summary-card ${card.className}`}
                  key={card.title}
                >
                  <div className="earn-card-top">
                    <span>{card.title}</span>
                    <div className="earn-card-icon">
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3>{card.amount}</h3>
                  <p>{card.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* MONTHLY EARNINGS CHART */}
        <section className="earn-chart-section">
          <div className="earn-section-heading">
            <div>
              <h2>Monthly Earnings Overview</h2>
              <p>
                Sales and rental income throughout the year.
              </p>
            </div>

            <div className="earn-chart-legend">
              <span>
                <i className="earn-legend-rent" />
                Rentals
              </span>
              <span>
                <i className="earn-legend-sales" />
                Sales
              </span>
            </div>
          </div>

          <div className="earn-chart">
            {monthlyData.map((item) => {
              const total = item.rentals + item.sales;
              const height = (total / maxMonthlyValue) * 100;
              const rentalPercentage =
                total > 0 ? (item.rentals / total) * 100 : 0;
              const salesPercentage =
                total > 0 ? (item.sales / total) * 100 : 0;

              return (
                <div className="earn-chart-column" key={item.month}>
                  <div
                    className="earn-chart-bar-area"
                    title={`${item.month}: ${currency(total)}`}
                  >
                    <div
                      className="earn-chart-stack"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="earn-chart-sales-bar"
                        style={{
                          height: `${salesPercentage}%`,
                        }}
                      />
                      <div
                        className="earn-chart-rent-bar"
                        style={{
                          height: `${rentalPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span>{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="earn-chart-footer">
            <TrendingUp size={16} />
            Only completed transactions contribute to earnings.
          </div>
        </section>

        {/* TRANSACTION HISTORY */}
        <section className="earn-history-section">
          <div className="earn-section-heading">
            <div>
              <h2>Transaction History</h2>
              <p>
                Review income from resource sales and rentals.
              </p>
            </div>

            <span className="earn-count">
              {filteredTransactions.length} transactions
            </span>
          </div>

          <div className="earn-toolbar">
            <div className="earn-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search transactions..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              className="earn-filter"
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option>All Transactions</option>
              <option>Rentals</option>
              <option>Sales</option>
            </select>
          </div>

          <div className="earn-table-wrapper">
            <table className="earn-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Resource</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td className="earn-resource-name">
                      {transaction.resource}
                    </td>
                    <td>
                      <span
                        className={
                          transaction.type === "Rent"
                            ? "earn-type-rent"
                            : "earn-type-sale"
                        }
                      >
                        {transaction.type === "Rent"
                          ? "Rental"
                          : "Sale"}
                      </span>
                    </td>
                    <td>{formatDate(transaction.date)}</td>
                    <td className="earn-amount">
                      {currency(transaction.amount)}
                    </td>
                    <td>
                      <span
                        className={
                          transaction.status === "Completed"
                            ? "earn-status-completed"
                            : "earn-status-pending"
                        }
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="earn-empty">
                <ReceiptText size={30} />
                <h3>No transactions found</h3>
                <p>
                  There are no matching transactions for this institution.
                </p>
              </div>
            )}
          </div>
        </section>

        <p className="earn-demo-note">
          Demonstration financial data only. Earnings shown here
          are illustrative and do not represent actual payments.
          Live earnings will be available after transaction
          processing is connected to the backend.
        </p>
      </main>

      {/* FOOTER */}
      <footer className="earn-footer">
        <strong>OmniCampus.</strong>
        <span>
          Connecting institutions. Creating opportunities.
        </span>
        <span>
          © {new Date().getFullYear()} OmniCampus
        </span>
      </footer>
    </div>
  );
}
