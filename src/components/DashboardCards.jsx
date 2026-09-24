import { useEffect, useState } from "react";

function DashboardCards() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch("http://capstone-project-loanprocessingplatform-production.up.railway.app/loan")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch loans");
        }
        return response.json();
      })
      .then((data) => {
        console.log("DASHBOARD LOANS:", data);
        setLoans(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Dashboard Error:", error);
      });
  }, []);

  const total = loans.length;

  const approved = loans.filter(
    (loan) =>
      String(loan.status).toLowerCase() === "approved"
  ).length;

  const pending = loans.filter(
    (loan) =>
      String(loan.status).toLowerCase() === "pending"
  ).length;

  const rejected = loans.filter(
    (loan) =>
      String(loan.status).toLowerCase() === "rejected"
  ).length;

  const cards = [
    {
      title: "Total Loans",
      value: total,
      icon: "📋",
      color: "#2563eb",
    },
    {
      title: "Approved",
      value: approved,
      icon: "✅",
      color: "#16a34a",
    },
    {
      title: "Pending",
      value: pending,
      icon: "⏳",
      color: "#f59e0b",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: "❌",
      color: "#dc2626",
    },
  ];

  return (
    <div className="container my-5">
      <div className="row">
        {cards.map((card, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div
              className="card shadow-lg border-0 text-center p-4"
              style={{ borderRadius: "20px" }}
            >
              <div style={{ fontSize: "50px" }}>
                {card.icon}
              </div>

              <h2
                className="fw-bold mt-3"
                style={{ color: card.color }}
              >
                {card.value}
              </h2>

              <p className="text-muted fs-5 mb-0">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardCards;