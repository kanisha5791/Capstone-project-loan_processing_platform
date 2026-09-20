import { useEffect, useState } from "react";

function LoanTable({ setSelectedLoan, refresh }) {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No JWT token found");
          setLoans([]);
          return;
        }

        let url = "http://localhost:8080/loan";

        if (search.trim() !== "") {
          url = `http://localhost:8080/loan/search?customerName=${encodeURIComponent(
            search.trim()
          )}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Fetch failed:", response.status);
          setLoans([]);
          return;
        }

        const data = await response.json();

        setLoans(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Fetch Error:", error);
        setLoans([]);
      }
    };

    fetchLoans();
  }, [refresh, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/loan/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Loan Deleted Successfully!");

        setLoans((prev) =>
          prev.filter((loan) => loan.id !== id)
        );
      } else {
        alert(`Delete Failed! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Server Error while deleting loan!");
    }
  };

  const handleEdit = (loan) => {
    setSelectedLoan(loan);
  };

  const handleStatusChange = async (loan, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/loan/${loan.id}/status?status=${encodeURIComponent(
          newStatus
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedData = await response.json();

        setLoans((prev) =>
          prev.map((item) =>
            item.id === loan.id ? updatedData : item
          )
        );

        alert("Status Updated Successfully!");
      } else {
        alert(
          `Status Update Failed! Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Status Error:", error);
      alert("Server Error while updating status!");
    }
  };

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 p-4"
        style={{ borderRadius: "20px" }}
      >
        <h2 className="text-center mb-4 fw-bold">
          Recent Loan Applications
        </h2>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>

                  <td>{loan.customerName}</td>

                  <td>{loan.loanType}</td>

                  <td>₹{loan.loanAmount}</td>

                  <td>
                    <select
                      className={
                        loan.status === "Approved"
                          ? "form-select form-select-sm bg-success text-white"
                          : loan.status === "Rejected"
                          ? "form-select form-select-sm bg-danger text-white"
                          : "form-select form-select-sm bg-warning"
                      }
                      value={loan.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(
                          loan,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(loan)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDelete(loan.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-danger fw-bold"
                >
                  No Results Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LoanTable;