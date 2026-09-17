import { useEffect, useState } from "react";

function DashboardCards({ refresh }) {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        // Only ADMIN can view overall loan statistics
        if (role !== "ADMIN") {
          return;
        }

        if (!token) {
          console.log("Admin token not found");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/loan",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch loans: ${response.status}`
          );
        }

        const data = await response.json();

        setStats({
          total: data.length,

          approved: data.filter(
            (loan) => loan.status === "Approved"
          ).length,

          pending: data.filter(
            (loan) => loan.status === "Pending"
          ).length,

          rejected: data.filter(
            (loan) => loan.status === "Rejected"
          ).length,
        });

      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    fetchStats();
  }, [refresh]);

  const cards = [
    {
      title: "Total Loans",
      value: stats.total,
      icon: "📋",
      color: "#2563eb",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: "✅",
      color: "#16a34a",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⏳",
      color: "#f59e0b",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: "❌",
      color: "#dc2626",
    },
  ];

  return (
    <div className="container my-5">
      <div className="row">

        {cards.map((card, index) => (
          <div
            className="col-md-3 mb-4"
            key={index}
          >
            <div
              className="card shadow-lg border-0 text-center p-4"
              style={{
                borderRadius: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "50px",
                }}
              >
                {card.icon}
              </div>

              <h2
                className="fw-bold mt-3"
                style={{
                  color: card.color,
                }}
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