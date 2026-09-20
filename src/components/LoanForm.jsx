import { useState } from "react";

function LoanForm({ refresh, setRefresh }) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    loanAmount: "",
    loanType: "",
    loanTerm: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const loanData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        loanAmount: Number(formData.loanAmount),
        loanType: formData.loanType,
        loanTerm: Number(formData.loanTerm),
        status: "Pending",
      };

      const response = await fetch("http://localhost:8080/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanData),
      });

      if (response.ok) {
        alert("Loan Application Submitted Successfully!");

        setFormData({
          customerName: "",
          email: "",
          phone: "",
          loanAmount: "",
          loanType: "",
          loanTerm: "",
        });

        if (setRefresh) {
          setRefresh(!refresh);
        }
      } else {
        const errorText = await response.text();
        console.error("Loan submission failed:", errorText);
        alert("Loan Application Failed!");
      }
    } catch (error) {
      console.error("Loan Error:", error);
      alert("Server Error while submitting loan!");
    }
  };

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 p-4"
        style={{ borderRadius: "20px" }}
      >
        <h2 className="text-center fw-bold mb-4">
          Loan Application
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                className="form-control"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Loan Amount
              </label>
              <input
                type="number"
                name="loanAmount"
                className="form-control"
                value={formData.loanAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Loan Type
              </label>
              <select
                name="loanType"
                className="form-select"
                value={formData.loanType}
                onChange={handleChange}
                required
              >
                <option value="">Select Loan Type</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Vehicle Loan">Vehicle Loan</option>
                <option value="Business Loan">Business Loan</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Loan Term (Months)
              </label>
              <input
                type="number"
                name="loanTerm"
                className="form-control"
                value={formData.loanTerm}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="text-center mt-3">
            <button
              type="submit"
              className="btn btn-primary px-5 py-2"
            >
              Submit Loan Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoanForm;