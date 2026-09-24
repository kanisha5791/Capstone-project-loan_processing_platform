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
          <div className="container mt-5 mb-5">
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
                  ✏️ Edit Loan
                </h2>

                <p className="mb-0">
                  Update customer and financial details
                </p>
              </div>

              <div className="p-4 p-md-5">
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
                        className="form-control form-control-lg"
                        value={selectedLoan.customerName || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            customerName: e.target.value,
                          })
                        }
                        placeholder="Enter customer name"
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control form-control-lg"
                        value={selectedLoan.email || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter email"
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={selectedLoan.phone || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter phone number"
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
                    {/* Loan Type */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Loan Type
                      </label>

                      <select
                        className="form-select form-select-lg"
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
                    </div>

                    {/* Loan Amount */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Loan Amount
                      </label>

                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={selectedLoan.loanAmount || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            loanAmount: e.target.value,
                          })
                        }
                        placeholder="Enter loan amount"
                        min="1"
                      />
                    </div>

                    {/* Loan Term */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Loan Term (Years)
                      </label>

                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={selectedLoan.loanTerm || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            loanTerm: e.target.value,
                          })
                        }
                        placeholder="Enter loan term"
                        min="1"
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
                        className="form-control form-control-lg"
                        value={selectedLoan.monthlyIncome || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            monthlyIncome: e.target.value,
                          })
                        }
                        placeholder="Enter monthly income"
                        min="0"
                      />
                    </div>

                    {/* Asset Value */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Asset Value
                      </label>

                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={selectedLoan.assetValue || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            assetValue: e.target.value,
                          })
                        }
                        placeholder="Enter asset value"
                        min="0"
                      />
                    </div>

                    {/* Existing EMI */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Existing EMI
                      </label>

                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={selectedLoan.existingEmi || ""}
                        onChange={(e) =>
                          setSelectedLoan({
                            ...selectedLoan,
                            existingEmi: e.target.value,
                          })
                        }
                        placeholder="Enter existing EMI"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-3">
                    📌 Application Status
                  </h5>

                  <hr />

                  <select
                    className="form-select form-select-lg"
                    value={selectedLoan.status || "Pending"}
                    onChange={(e) =>
                      setSelectedLoan({
                        ...selectedLoan,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-success btn-lg px-5 me-3"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");

                        const response = await fetch(
                          
                          `https://capstone-project-loanprocessingplatform-production.up.railway.app/loan/${selectedLoan.id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              ...selectedLoan,
                              loanAmount: Number(selectedLoan.loanAmount),
                              loanTerm: Number(selectedLoan.loanTerm),
                              monthlyIncome: Number(selectedLoan.monthlyIncome),
                              assetValue: Number(selectedLoan.assetValue),
                              existingEmi: Number(selectedLoan.existingEmi),
                            }),
                          }
                        );

                        if (response.ok) {
                          alert("Loan Updated Successfully!");
                          setSelectedLoan(null);
                          setRefresh((prev) => prev + 1);
                        } else {
                          const errorText = await response.text();
                          alert(errorText || "Update Failed!");
                        }
                      } catch (error) {
                        console.error("Update Error:", error);
                        alert("Server Error!");
                      }
                    }}
                  >
                    💾 Save Changes
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-lg px-5"
                    onClick={() => setSelectedLoan(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
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
    monthlyIncome: "",
    assetValue: "",
    existingEmi: "",
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
          "https://capstone-project-loanprocessingplatform-production.up.railway.app/documents/upload",
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
      !loan.loanTerm ||
      !loan.monthlyIncome ||
      !loan.assetValue ||
      loan.existingEmi === ""
    ) {

      setMessage("Please fill all fields");

      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
      
        "https://capstone-project-loanprocessingplatform-production.up.railway.app/loan",
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

            monthlyIncome: Number(loan.monthlyIncome),

            assetValue: Number(loan.assetValue),

            existingEmi: Number(loan.existingEmi),

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
        monthlyIncome: "",
        assetValue: "",
        existingEmi: "",

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
      
        `https://capstone-project-loanprocessingplatform-production.up.railway.app/loan/customer/email?email=${encodeURIComponent(email)}`,
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
            {/* Back Button */}
            <button
              type="button"
              className="btn btn-outline-secondary mb-4"
              onClick={() => {
                setShowApplyLoan(false);
                setShowApply(false);
              }}
            >
              ← Back
            </button>

            {/* Loan Application Card */}
            <div
              className="card border-0 shadow-lg mx-auto mb-5"
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
                  Enter your details to submit a loan application
                </p>
              </div>

              <div className="p-4 p-md-5">
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
                          placeholder="Enter your name"
                          value={loan.customerName}
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
                          className="form-control form-control-lg"
                          value={loan.email}
                          readOnly
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
                          value={loan.phone}
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
                          value={loan.loanAmount}
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
                          value={loan.loanType}
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

                          <option value="Vehicle Loan">
                            Vehicle Loan
                          </option>

                          <option value="Business Loan">
                            Business Loan
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
                          value={loan.loanTerm}
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
                          value={loan.monthlyIncome}
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
                          placeholder="Enter asset value"
                          value={loan.assetValue}
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
                          value={loan.existingEmi}
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
{/* ================= CUSTOMER CONTACT ================= */}

<section
  className="py-5 mt-5"
  style={{
    background:
      "linear-gradient(135deg, #eff6ff, #f8fafc)",
    borderTop: "1px solid #dbeafe",
  }}
>
  <div className="container">

    <div
      className="card border-0 shadow-sm mx-auto"
      style={{
        maxWidth: "900px",
        borderRadius: "18px",
      }}
    >
      <div className="p-4 p-md-5 text-center">

        <h2 className="fw-bold mb-2">
          📞 Contact Us
        </h2>

        <p className="text-muted mb-4">
          Need help with your loan application?
          We're here to assist you.
        </p>

        <div className="row justify-content-center">

          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded-3">
              <div className="fs-4 mb-2">📧</div>
              <div className="fw-bold">
                Email
              </div>
              <div className="text-muted">
                support@loanplatform.com
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded-3">
              <div className="fs-4 mb-2">📞</div>
              <div className="fw-bold">
                Phone
              </div>
              <div className="text-muted">
                +91 98765 43210
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded-3">
              <div className="fs-4 mb-2">🏦</div>
              <div className="fw-bold">
                Platform
              </div>
              <div className="text-muted">
                Digital Lending Platform
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</section>
      </div>

    </div>

  );
}

export default App;