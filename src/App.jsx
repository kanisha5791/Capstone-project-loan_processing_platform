import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./Hero";
import DashboardCards from "./components/DashboardCards";
import LoanForm from "./components/LoanForm";
import LoanTable from "./components/LoanTable";
import DocumentTable from "./components/DocumentTable";
import LoanCalculator from "./components/LoanCalculator";
import Login from "./components/Login";
import CustomerLogin from "./components/CustomerLogin";
import CustomerRegister from "./components/CustomerRegister";

function App() {
  const [userType, setUserType] = useState(
    localStorage.getItem("role") === "ADMIN" &&
      localStorage.getItem("token")
      ? "admin"
      : null
  );

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [customerLoan, setCustomerLoan] = useState(null);
 const [showDocuments, setShowDocuments] = useState(false);
 const [showLoans, setShowLoans] = useState(false);
  // =========================
  // ADMIN LOGIN
  // =========================

  const handleAdminLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);

    setUserType("admin");
  };

  // =========================
  // CUSTOMER LOGIN
  // =========================

  const handleCustomerLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);

    setCustomerLoan(null);

    setUserType("customer");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setUserType(null);
    setSelectedLoan(null);
    setCustomerLoan(null);
  };

  // =========================
  // ADMIN HOME
  // =========================

  const handleHome = () => {
    document.getElementById("home")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =========================
  // ADMIN APPLY LOAN
  // =========================

  const handleApplyLoan = () => {
    setSelectedLoan(null);

    document.getElementById("loan-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =========================
  // ADMIN VIEW LOANS
  // =========================

  const handleViewLoans = () => {
    document.getElementById("loan-table")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =========================
  // ADMIN CONTACT
  // =========================

  const handleContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =====================================================
  // LOGIN SELECTION
  // =====================================================

  if (!userType) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#f8fafc,#dbeafe)",
          paddingTop: "60px",
        }}
      >
        <div className="container">

          <div className="text-center mb-5">

            <div style={{ fontSize: "60px" }}>
              🏦
            </div>

            <h1 className="fw-bold">
              Digital Lending & Loan Processing
            </h1>

            <p className="text-muted fs-5">
              Choose your login type
            </p>

          </div>

          <div className="row justify-content-center">

            {/* ADMIN */}

            <div className="col-md-4 mb-4">

              <div className="card shadow-lg border-0 p-4 text-center h-100">

                <div style={{ fontSize: "55px" }}>
                  👨‍💼
                </div>

                <h3 className="fw-bold mt-3">
                  Admin
                </h3>

                <p className="text-muted">
                  Manage and process loan applications
                </p>

                <button
                  className="btn btn-dark btn-lg"
                  onClick={() =>
                    setUserType("adminLogin")
                  }
                >
                  Admin Login
                </button>

              </div>

            </div>

            {/* CUSTOMER */}

            <div className="col-md-4 mb-4">

              <div className="card shadow-lg border-0 p-4 text-center h-100">

                <div style={{ fontSize: "55px" }}>
                  👤
                </div>

                <h3 className="fw-bold mt-3">
                  Customer
                </h3>

                <p className="text-muted">
                  Apply and track your loan
                </p>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={() =>
                    setUserType("customerLogin")
                  }
                >
                  Customer Login
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  if (userType === "adminLogin") {
    return (
      <Login
        onLogin={handleAdminLogin}
      />
    );
  }

  // =====================================================
  // CUSTOMER LOGIN
  // =====================================================

  if (userType === "customerLogin") {
    return (
      <CustomerLogin
        onLogin={handleCustomerLogin}
        onRegister={() =>
          setUserType("customerRegister")
        }
      />
    );
  }

  // =====================================================
  // CUSTOMER REGISTER
  // =====================================================

  if (userType === "customerRegister") {
    return (
      <CustomerRegister
        onRegister={() =>
          setUserType("customerLogin")
        }
        onBackToLogin={() =>
          setUserType("customerLogin")
        }
      />
    );
  }

  // =====================================================
  // CUSTOMER DASHBOARD
  // =====================================================

  if (userType === "customer") {
    return (
      <CustomerDashboard
        customerLoan={customerLoan}
        setCustomerLoan={setCustomerLoan}
        onLogout={handleLogout}
      />
    );
  }

  // =====================================================
  // ADMIN MAIN APPLICATION
  // =====================================================

  return (
    <>
      <Navbar
        onHome={handleHome}
        onApplyLoan={handleApplyLoan}
        onViewLoans={handleViewLoans}
        onContact={handleContact}
      />

      {/* ADMIN BAR */}

      <div
        style={{
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e5e7eb",
          padding: "10px 0",
        }}
      >

        <div className="container d-flex justify-content-end align-items-center">

          <span
            className="me-3 fw-semibold"
            style={{
              color: "#374151",
            }}
          >
            👨‍💼 Admin
          </span>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </div>

      {/* =========================
          HOME
      ========================= */}

      <div id="home">

        <Hero
          onApplyNow={handleApplyLoan}
          onViewLoans={handleViewLoans}
        />

      </div>

      {/* =========================
          DASHBOARD CARDS
      ========================= */}

      <DashboardCards refresh={refresh} />

<div className="text-center mb-4">

  <button
    className="btn btn-success btn-lg me-2"
    onClick={() => {
      setShowLoans(true);
      setShowDocuments(false);
    }}
  >
    💰 View Loans
  </button>

  <button
    className="btn btn-primary btn-lg"
    onClick={() => {
      setShowDocuments(true);
      setShowLoans(false);
    }}
  >
    📄 Documents
  </button>

</div>

      {/* =========================
          LOAN FORM
      ========================= */}

      <div id="loan-form">

        <LoanForm
          selectedLoan={selectedLoan}
          setSelectedLoan={setSelectedLoan}
          refresh={refresh}
          setRefresh={setRefresh}
        />

      </div>

      {/* =========================
          LOAN TABLE
      ========================= */}

      <div id="loan-table">
        
          {showLoans && (
  <>
    <button
      className="btn btn-secondary mb-3"
      onClick={() => setShowLoans(false)}
    >
      ← Back to Dashboard
    </button>

    <LoanTable
      setSelectedLoan={setSelectedLoan}
      refresh={refresh}
    />
  </>
)}
        {showDocuments && (
  <>
    <button
      className="btn btn-secondary mb-3"
      onClick={() => setShowDocuments(false)}
    >
      ← Back to Dashboard
    </button>

    <DocumentTable />
  </>
)}
        
        {/* EDIT LOAN */}

        {selectedLoan && (

          <div className="container mt-4">

            <div className="card p-4 shadow">

              <h3>Edit Loan</h3>

              <select
                className="form-control mb-2"
                value={selectedLoan.loanType || ""}
                onChange={(e) =>
                  setSelectedLoan({
                    ...selectedLoan,
                    loanType: e.target.value,
                  })
                }
              >

                <option value="">
                  Select Loan Type
                </option>

                <option value="Personal Loan">
                  Personal Loan
                </option>

                <option value="Home Loan">
                  Home Loan
                </option>

                <option value="Car Loan">
                  Car Loan
                </option>

                <option value="Education Loan">
                  Education Loan
                </option>

                <option value="Vehicle Loan">
                  Vehicle Loan
                </option>

                <option value="Business Loan">
                  Business Loan
                </option>

              </select>

              <input
                className="form-control mb-2"
                value={selectedLoan.email || ""}
                onChange={(e) =>
                  setSelectedLoan({
                    ...selectedLoan,
                    email: e.target.value,
                  })
                }
                placeholder="Email"
              />

              <input
                className="form-control mb-2"
                value={selectedLoan.phone || ""}
                onChange={(e) =>
                  setSelectedLoan({
                    ...selectedLoan,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone"
              />

              <input
                className="form-control mb-2"
                type="number"
                value={selectedLoan.loanAmount || ""}
                onChange={(e) =>
                  setSelectedLoan({
                    ...selectedLoan,
                    loanAmount: e.target.value,
                  })
                }
                placeholder="Loan Amount"
              />

              <button
                className="btn btn-success me-2"
                onClick={async () => {

                  try {

                    const token =
                      localStorage.getItem("token");

                    const response = await fetch(
                      `http://localhost:8080/loan/${selectedLoan.id}`,
                      {
                        method: "PUT",

                        headers: {
                          "Content-Type":
                            "application/json",

                          "Authorization":
                            `Bearer ${token}`,
                        },

                        body:
                          JSON.stringify(selectedLoan),
                      }
                    );

                    if (response.ok) {

                      alert(
                        "Loan Updated Successfully!"
                      );

                      setSelectedLoan(null);

                      setRefresh(
                        (prev) => prev + 1
                      );

                    } else {

                      alert(
                        "Update Failed!"
                      );

                    }

                  } catch (error) {

                    console.error(error);

                    alert(
                      "Server Error!"
                    );

                  }

                }}
              >
                Save Changes
              </button>

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setSelectedLoan(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      </div>

      {/* =========================
          CONTACT
      ========================= */}

      <section
        id="contact"
        className="py-5"
        style={{
          backgroundColor: "#111827",
          color: "white",
        }}
      >

        <div className="container text-center">

          <h2 className="fw-bold mb-3">
            Contact Us
          </h2>

          <p className="mb-2">
            Have questions about your loan?
          </p>

          <p className="mb-1">
            📧 Email: support@loanplatform.com
          </p>

          <p className="mb-1">
            📞 Phone: +91 98765 43210
          </p>

          <p className="mb-0">
            🏦 Digital Lending & Loan Processing Platform
          </p>

        </div>

      </section>

    </>
  );
}

// =====================================================
// CUSTOMER DASHBOARD COMPONENT
// =====================================================

function CustomerDashboard({
  customerLoan,
  setCustomerLoan,
  onLogout,
}) {

  const [showApply, setShowApply] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [loan, setLoan] = useState({
    customerName: "",
    email: localStorage.getItem("email") || "",
    phone: "",
    loanAmount: "",
    loanType: "",
    loanTerm: "",
  });

  // =========================
  // SECTION STATES
  // =========================

  const [showApplyLoan, setShowApplyLoan] = useState(false);
  const [showTrackLoan, setShowTrackLoan] = useState(false);
  const [showEMI, setShowEMI] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  // =========================
  // DOCUMENT STATES
  // =========================

  const [documents, setDocuments] = useState({
    "Aadhaar Card": null,
    "PAN Card": null,
    "Income Proof": null,
    "Bank Statement": null,
  });

  const handleDocumentChange = (documentType, file) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: file,
    }));
  };

  const handleDocumentSubmit = async () => {
    try {

      const email = localStorage.getItem("email");

      if (!email) {
        alert("Customer email not found!");
        return;
      }

      for (const [documentType, file] of Object.entries(documents)) {

        if (!file) {
          alert(`Please upload ${documentType}`);
          return;
        }

      }

      for (const [documentType, file] of Object.entries(documents)) {

        const formData = new FormData();

        formData.append("file", file);
        formData.append("email", email);
        formData.append("documentType", documentType);

        const response = await fetch(
          "http://localhost:8080/documents/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          alert(`${documentType} upload failed!`);
          return;
        }

      }

      alert("All Documents Submitted Successfully! 📄✅");

      setDocuments({
        "Aadhaar Card": null,
        "PAN Card": null,
        "Income Proof": null,
        "Bank Statement": null,
      });

    } catch (error) {

      console.error("Document Upload Error:", error);

      alert("Server Error while uploading documents!");

    }
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    setLoan({
      ...loan,
      [e.target.name]: e.target.value,
    });

  };

  // =========================
  // APPLY LOAN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !loan.customerName ||
      !loan.email ||
      !loan.phone ||
      !loan.loanAmount ||
      !loan.loanType ||
      !loan.loanTerm
    ) {

      setMessage("Please fill all fields");

      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/loan",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({

            customerName: loan.customerName,
            email: loan.email,
            phone: loan.phone,

            loanAmount: Number(loan.loanAmount),

            loanType: loan.loanType,

            loanTerm: Number(loan.loanTerm),

            status: "Pending",

          }),
        }
      );

      if (!response.ok) {

        const errorText = await response.text();

        console.error(errorText);

        setMessage(
          `Application failed. Status: ${response.status}`
        );

        setLoading(false);

        return;
      }

      const data = await response.json();

      setCustomerLoan(data);

      setShowApply(false);

      setMessage(
        "Loan Application Submitted Successfully!"
      );

      setLoan({

        ...loan,

        customerName: "",
        phone: "",
        loanAmount: "",
        loanType: "",
        loanTerm: "",

      });

    } catch (error) {

      console.error(error);

      setMessage(
        "Unable to connect to the server"
      );

    }

    setLoading(false);

  };

  // =========================
  // TRACK MY LOAN
  // =========================

  const handleTrackLoan = async () => {

    try {

      const token = localStorage.getItem("token");

      const email = localStorage.getItem("email");

      const response = await fetch(
        `http://localhost:8080/loan/customer/email?email=${encodeURIComponent(email)}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        setMessage(
          "Unable to load your loan details"
        );

        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {

        if (data.length === 0) {

          setCustomerLoan(null);

          setMessage(
            "No loan application found"
          );

          return;
        }

        setCustomerLoan(
          data[data.length - 1]
        );

      } else {

        setCustomerLoan(data);

      }

    } catch (error) {

      console.error(error);

      setMessage(
        "Unable to connect to the server"
      );

    }

  };

  // =========================
  // RETURN
  // =========================

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8fafc,#dbeafe)",
      }}
    >

      {/* ================= HEADER ================= */}

      <div
        style={{
          backgroundColor: "#111827",
          color: "white",
          padding: "15px 0",
        }}
      >

        <div className="container d-flex justify-content-between align-items-center">

          <h4 className="mb-0">
            🏦 Digital Lending Platform
          </h4>

          <div>

            <span className="me-3">
              👤 Customer
            </span>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onLogout}
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </div>


      {/* ================= MAIN ================= */}

      <div className="container py-5">

        <div className="text-center mb-5">

          <div
            style={{
              fontSize: "60px",
            }}
          >
            👤
          </div>

          <h1 className="fw-bold">
            Customer Dashboard
          </h1>

          <p className="text-muted">
            Apply for a loan and track your application
          </p>

        </div>


        {/* ================= MESSAGE ================= */}

        {message && (

          <div className="alert alert-info text-center">
            {message}
          </div>

        )}


        {/* ================= FOUR BUTTONS ================= */}

        <div className="text-center mb-4">

          {/* APPLY LOAN */}

          <button
            type="button"
            className="btn btn-primary btn-lg me-2"
            onClick={() => {

              setShowApplyLoan(true);
              setShowApply(true);

              setShowTrackLoan(false);
              setShowEMI(false);
              setShowDocuments(false);

            }}
          >
            📝 Apply for Loan
          </button>


          {/* TRACK LOAN */}

          <button
            type="button"
            className="btn btn-success btn-lg me-2"
            onClick={() => {

              setShowApplyLoan(false);
              setShowApply(false);

              setShowTrackLoan(true);

              setShowEMI(false);
              setShowDocuments(false);

              handleTrackLoan();

            }}
          >
            🔍 Track My Loan
          </button>


          {/* EMI */}

          <button
            type="button"
            className="btn btn-warning btn-lg me-2"
            onClick={() => {

              setShowApplyLoan(false);
              setShowApply(false);

              setShowTrackLoan(false);

              setShowEMI(true);

              setShowDocuments(false);

            }}
          >
            🧮 EMI Calculator
          </button>


          {/* DOCUMENTS */}

          <button
            type="button"
            className="btn btn-info btn-lg"
            onClick={() => {

              setShowApplyLoan(false);
              setShowApply(false);

              setShowTrackLoan(false);
              setShowEMI(false);

              setShowDocuments(true);

            }}
          >
            📄 Documents
          </button>

        </div>


        {/* ================================================= */}
        {/* APPLY FOR LOAN */}
        {/* ================================================= */}

        {showApplyLoan && (

          <div>

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={() => {

                setShowApplyLoan(false);
                setShowApply(false);

              }}
            >
              ← Back
            </button>


            <div className="card shadow-lg border-0 p-5 mb-5">

              <h2 className="fw-bold text-center mb-4">
                Loan Application
              </h2>


              <form onSubmit={handleSubmit}>

                <div className="row">


                  {/* NAME */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      Customer Name
                    </label>

                    <input
                      type="text"
                      name="customerName"
                      className="form-control"
                      placeholder="Enter your name"
                      value={loan.customerName}
                      onChange={handleChange}
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      value={loan.email}
                      readOnly
                    />

                  </div>


                  {/* PHONE */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Enter phone number"
                      value={loan.phone}
                      onChange={handleChange}
                    />

                  </div>


                  {/* AMOUNT */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      Loan Amount
                    </label>

                    <input
                      type="number"
                      name="loanAmount"
                      className="form-control"
                      placeholder="Enter loan amount"
                      value={loan.loanAmount}
                      onChange={handleChange}
                    />

                  </div>


                  {/* TYPE */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      Loan Type
                    </label>

                    <select
                      name="loanType"
                      className="form-select"
                      value={loan.loanType}
                      onChange={handleChange}
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


                  {/* TERM */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      Loan Term (Years)
                    </label>

                    <input
                      type="number"
                      name="loanTerm"
                      className="form-control"
                      placeholder="Enter loan term"
                      value={loan.loanTerm}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="text-center mt-3">

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >

                    {loading
                      ? "Submitting..."
                      : "Submit Application"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* TRACK MY LOAN */}
        {/* ================================================= */}

        {showTrackLoan && (

          <div>

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={() =>
                setShowTrackLoan(false)
              }
            >
              ← Back
            </button>


            {customerLoan ? (

              <div
                className="card shadow-lg border-0 p-5"
                style={{
                  borderRadius: "20px",
                }}
              >

                <h2 className="fw-bold text-center mb-4">
                  My Loan
                </h2>


                <div className="row mb-3">

                  <div className="col-6">
                    <strong>Loan ID</strong>
                  </div>

                  <div className="col-6">
                    {customerLoan.id}
                  </div>

                </div>


                <div className="row mb-3">

                  <div className="col-6">
                    <strong>Customer Name</strong>
                  </div>

                  <div className="col-6">
                    {customerLoan.customerName}
                  </div>

                </div>


                <div className="row mb-3">

                  <div className="col-6">
                    <strong>Email</strong>
                  </div>

                  <div className="col-6">
                    {customerLoan.email}
                  </div>

                </div>


                <div className="row mb-3">

                  <div className="col-6">
                    <strong>Phone</strong>
                  </div>

                  <div className="col-6">
                    {customerLoan.phone}
                  </div>

                </div>


                <div className="row mb-3">

                  <div className="col-6">
                    <strong>Loan Type</strong>
                  </div>

                  <div className="col-6">
                    {customerLoan.loanType}
                  </div>

                </div>


                <div className="row mb-3">

                  <div className="col-6">
                    <strong>Loan Amount</strong>
                  </div>

                  <div className="col-6">
                    ₹ {customerLoan.loanAmount}
                  </div>

                </div>


                <div className="row mb-3">

                  <div className="col-6">
                    <strong>Loan Term</strong>
                  </div>

                  <div className="col-6">
                    {customerLoan.loanTerm} Years
                  </div>

                </div>


                <hr />


                <div className="text-center mt-4">

                  <h4 className="fw-bold mb-3">
                    Application Status
                  </h4>


                  {customerLoan.status === "Approved" && (

                    <div className="alert alert-success">

                      <h4 className="fw-bold">
                        ✅ Loan Approved
                      </h4>

                      <p className="mb-0">
                        Congratulations! Your loan application
                        has been approved.
                      </p>

                    </div>

                  )}


                  {customerLoan.status === "Rejected" && (

                    <div className="alert alert-danger">

                      <h4 className="fw-bold">
                        ❌ Loan Rejected
                      </h4>

                      <p className="mb-0">
                        Your loan application has been rejected.
                      </p>

                    </div>

                  )}


                  {customerLoan.status !== "Approved" &&
                    customerLoan.status !== "Rejected" && (

                      <div className="alert alert-warning">

                        <h4 className="fw-bold">
                          ⏳ Application Under Review
                        </h4>

                        <p className="mb-0">
                          Your loan application is currently
                          being reviewed by the admin.
                        </p>

                      </div>

                    )}

                </div>

              </div>

            ) : (

              <div className="alert alert-warning text-center">
                No loan application found.
              </div>

            )}

          </div>

        )}


        {/* ================================================= */}
        {/* EMI CALCULATOR */}
        {/* ================================================= */}

        {showEMI && (

          <div>

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={() =>
                setShowEMI(false)
              }
            >
              ← Back
            </button>


            <div
              id="loan-calculator"
              className="mb-5"
            >

              <LoanCalculator />

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* DOCUMENTS */}
        {/* ================================================= */}

        {showDocuments && (

          <div>

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={() =>
                setShowDocuments(false)
              }
            >
              ← Back
            </button>


            <div className="container my-5">

              <div
                className="card shadow-lg border-0 p-4"
                style={{
                  borderRadius: "20px",
                }}
              >

                <h2 className="text-center fw-bold mb-4">
                  📄 Document Submission
                </h2>


                <p className="text-center text-muted mb-4">
                  Upload the required documents for your loan application.
                </p>


                <div className="row">


                  {/* AADHAAR */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      Aadhaar Card
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleDocumentChange(
                          "Aadhaar Card",
                          e.target.files[0]
                        )
                      }
                    />

                  </div>


                  {/* PAN */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      PAN Card
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleDocumentChange(
                          "PAN Card",
                          e.target.files[0]
                        )
                      }
                    />

                  </div>


                  {/* INCOME PROOF */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      Income Proof
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleDocumentChange(
                          "Income Proof",
                          e.target.files[0]
                        )
                      }
                    />

                  </div>


                  {/* BANK STATEMENT */}

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      Bank Statement
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleDocumentChange(
                          "Bank Statement",
                          e.target.files[0]
                        )
                      }
                    />

                  </div>

                </div>


                <div className="text-center mt-3">

                  <button
                    type="button"
                    className="btn btn-primary px-5 py-2"
                    onClick={handleDocumentSubmit}
                  >
                    Submit Documents
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}
export default App;