import { useState } from "react";

function LoanForm({
  selectedLoan,
  setSelectedLoan,
  refresh,
  setRefresh,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    loanAmount: "",
    loanType: "",
    loanTerm: "",
    monthlyIncome: "",
    assetValue: "",
    existingEmi: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (
      !formData.customerName ||
      !formData.email ||
      !formData.phone ||
      !formData.loanAmount ||
      !formData.loanType ||
      !formData.loanTerm ||
      !formData.monthlyIncome ||
      !formData.assetValue
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (formData.existingEmi === "") {
      setMessage("Please enter existing EMI.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://capstone-project-loanprocessingplatform-production.up.railway.app/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          loanAmount: Number(formData.loanAmount),
          loanType: formData.loanType,
          loanTerm: Number(formData.loanTerm),
          monthlyIncome: Number(formData.monthlyIncome),
          assetValue: Number(formData.assetValue),
          existingEmi: Number(formData.existingEmi),
          status: "Pending",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Loan Submit Error:", errorText);

        setMessage(
          `Loan application failed. Status: ${response.status}`
        );

        setLoading(false);
        return;
      }

      await response.json();

      setMessage("Loan Application Submitted Successfully! ✅");

      setFormData({
        customerName: "",
        email: "",
        phone: "",
        loanAmount: "",
        loanType: "",
        loanTerm: "",
        monthlyIncome: "",
        assetValue: "",
        existingEmi: "",
      });

      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Server Error:", error);
      setMessage("Unable to connect to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="container my-5">
      <div
        className="card border-0 shadow-lg mx-auto"
        style={{
          maxWidth: "1000px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="text-white text-center p-4"
          style={{
            background:
              "linear-gradient(135deg, #1e3a8a, #2563eb)",
          }}
        >
          <h2 className="fw-bold mb-2">
            📝 Loan Application
          </h2>

          <p className="mb-0">
            Enter customer details to create a loan application
          </p>
        </div>

        <div className="p-4 p-md-5">
          {message && (
            <div
              className={`alert text-center fw-semibold ${
                message.includes("Successfully")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Customer Details */}
            <div className="mb-5">
              <h5 className="fw-bold mb-3">
                👤 Customer Details
              </h5>

              <hr />

              <div className="row">
                {/* Customer Name */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    className="form-control form-control-lg"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control form-control-lg"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="mb-5">
              <h5 className="fw-bold mb-3">
                💰 Loan Details
              </h5>

              <hr />

              <div className="row">
                {/* Loan Amount */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Loan Amount
                  </label>

                  <input
                    type="number"
                    name="loanAmount"
                    className="form-control form-control-lg"
                    placeholder="Enter loan amount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                {/* Loan Type */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Loan Type
                  </label>

                  <select
                    name="loanType"
                    className="form-select form-select-lg"
                    value={formData.loanType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Loan Type
                    </option>

                    <option value="Home Loan">
                      Home Loan
                    </option>

                    <option value="Car Loan">
                      Car Loan
                    </option>

                    <option value="Personal Loan">
                      Personal Loan
                    </option>

                    <option value="Education Loan">
                      Education Loan
                    </option>
                  </select>
                </div>

                {/* Loan Term */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Loan Term (Years)
                  </label>

                  <input
                    type="number"
                    name="loanTerm"
                    className="form-control form-control-lg"
                    placeholder="Enter loan term"
                    value={formData.loanTerm}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="mb-5">
              <h5 className="fw-bold mb-3">
                📊 Financial Details
              </h5>

              <hr />

              <div className="row">
                {/* Monthly Income */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Monthly Income
                  </label>

                  <input
                    type="number"
                    name="monthlyIncome"
                    className="form-control form-control-lg"
                    placeholder="Enter monthly income"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                {/* Asset Value */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Asset Value
                  </label>

                  <input
                    type="number"
                    name="assetValue"
                    className="form-control form-control-lg"
                    placeholder="Enter total asset value"
                    value={formData.assetValue}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                {/* Existing EMI */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Existing EMI
                  </label>

                  <input
                    type="number"
                    name="existingEmi"
                    className="form-control form-control-lg"
                    placeholder="Enter existing EMI"
                    value={formData.existingEmi}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-5 py-3"
                disabled={loading}
                style={{
                  borderRadius: "10px",
                  minWidth: "240px",
                }}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoanForm;