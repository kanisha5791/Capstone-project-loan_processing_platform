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

        let url = "http://capstone-project-loanprocessingplatform-production.up.railway.app/loan";

        if (search.trim() !== "") {
          url = `http://capstone-project-loanprocessingplatform-production.up.railway.app/loan/search?customerName=${encodeURIComponent(
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
    if (!window.confirm("Are you sure you want to delete this loan?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://capstone-project-loanprocessingplatform-production.up.railway.app/loan/${id}`,
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
        `http://capstone-project-loanprocessingplatform-production.up.railway.app/loan/${loan.id}/status?status=${encodeURIComponent(
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
        const errorMessage = await response.text();

        alert(errorMessage || "Status Update Failed!");
      }
    } catch (error) {
      console.error("Status Error:", error);
      alert("Server Error while updating status!");
    }
  };

  return (
    <div className="container my-5">

      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >

        {/* HEADER */}
        <div
          className="p-4"
          style={{
            background:
              "linear-gradient(135deg, #1e3a8a, #2563eb)",
            color: "white",
          }}
        >
          <h2 className="fw-bold text-center mb-1">
            Recent Loan Applications
          </h2>

          <p className="text-center mb-0 opacity-75">
            Manage customer loan applications
          </p>
        </div>


        {/* SEARCH */}
        <div className="p-4 pb-2">

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              borderRadius: "10px",
              padding: "11px 14px",
            }}
          />

        </div>


        {/* TABLE */}
        <div className="table-responsive p-4 pt-2">

          <table
            className="table table-hover align-middle text-center mb-0"
            style={{
              fontSize: "14px",
              minWidth: "900px",
            }}
          >

            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >

                <th className="py-3 px-3">
                  ID
                </th>

                <th className="py-3 px-3">
                  Customer
                </th>

                <th className="py-3 px-3">
                  Loan Type
                </th>

                <th className="py-3 px-3">
                  Amount
                </th>

                <th className="py-3 px-3">
                  Eligibility
                </th>

                <th className="py-3 px-3">
                  Status
                </th>

                <th className="py-3 px-3">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody>

              {loans.length > 0 ? (

                loans.map((loan) => (

                  <tr
                    key={loan.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >

                    {/* ID */}
                    <td className="fw-semibold">
                      #{loan.id}
                    </td>


                    {/* CUSTOMER */}
                    <td>
                      <span className="fw-semibold">
                        {loan.customerName}
                      </span>
                    </td>


                    {/* LOAN TYPE */}
                    <td>
                      <span
                        className="badge bg-light text-dark border"
                        style={{
                          padding: "7px 10px",
                          borderRadius: "8px",
                        }}
                      >
                        {loan.loanType}
                      </span>
                    </td>


                    {/* AMOUNT */}
                    <td>
                      <span className="fw-semibold">
                        ₹{loan.loanAmount}
                      </span>
                    </td>


                    {/* ELIGIBILITY */}
                    <td>

                      {loan.eligibilityStatus === "Eligible" && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                          ✅ Eligible
                        </span>
                      )}

                      {loan.eligibilityStatus === "Not Eligible" && (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2">
                          ❌ Not Eligible
                        </span>
                      )}

                      {loan.eligibilityStatus !== "Eligible" &&
                        loan.eligibilityStatus !== "Not Eligible" && (
                          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2">
                            ⚠️ Review
                          </span>
                        )}

                    </td>


                    {/* STATUS */}
                    <td>

                      <select
                        className={
                          loan.status === "Approved"
                            ? "form-select form-select-sm bg-success text-white fw-semibold"
                            : loan.status === "Rejected"
                            ? "form-select form-select-sm bg-danger text-white fw-semibold"
                            : "form-select form-select-sm bg-warning fw-semibold"
                        }
                        value={loan.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(
                            loan,
                            e.target.value
                          )
                        }
                        style={{
                          minWidth: "110px",
                          borderRadius: "8px",
                        }}
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


                    {/* ACTIONS */}
                    <td>

                      <div className="d-flex justify-content-center gap-2">

                        <button
                          className="btn btn-primary btn-sm px-3"
                          onClick={() => handleEdit(loan)}
                          style={{
                            borderRadius: "8px",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm px-3"
                          onClick={() =>
                            handleDelete(loan.id)
                          }
                          style={{
                            borderRadius: "8px",
                          }}
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="text-danger fw-bold py-5"
                  >
                    No Results Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default LoanTable;