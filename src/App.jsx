import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./Hero";
import DashboardCards from "./components/DashboardCards";
import LoanForm from "./components/LoanForm";
import LoanTable from "./components/LoanTable";
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

      {/* HOME */}

      <div id="home">

        <Hero
          onApplyNow={handleApplyLoan}
          onViewLoans={handleViewLoans}
        />

      </div>

      {/* LOAN FORM */}

      <div id="loan-form">

        <LoanForm
          selectedLoan={selectedLoan}
          setSelectedLoan={setSelectedLoan}
          refresh={refresh}
          setRefresh={setRefresh}
        />

      </div>

      {/* LOAN TABLE */}

      <div id="loan-table">

        <LoanTable
          setSelectedLoan={setSelectedLoan}
          refresh={refresh}
        />

      </div>

      {/* CONTACT */}

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

  const [showApply, setShowApply] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [loan, setLoan] = useState({

    customerName: "",

    email:
      localStorage.getItem("email") || "",

    phone: "",

    loanAmount: "",

    loanType: "",

    loanTerm: "",
  });

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    setLoan({
      ...loan,

      [e.target.name]:
        e.target.value,
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

      setMessage(
        "Please fill all fields"
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "http://localhost:8080/loan",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({

              customerName:
                loan.customerName,

              email:
                loan.email,

              phone:
                loan.phone,

              loanAmount:
                Number(
                  loan.loanAmount
                ),

              loanType:
                loan.loanType,

              loanTerm:
                Number(
                  loan.loanTerm
                ),

              status:
                "Pending",
            }),
          }
        );

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          errorText
        );

        setMessage(
          `Application failed. Status: ${response.status}`
        );

        setLoading(false);

        return;
      }

      const data =
        await response.json();

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

  const handleTrackLoan =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const email =
          localStorage.getItem(
            "email"
          );

        const response =
          await fetch(
            `http://localhost:8080/loan/customer/email?email=${encodeURIComponent(
              email
            )}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!response.ok) {

          setMessage(
            "Unable to load your loan details"
          );

          return;
        }

        const data =
          await response.json();

        if (
          Array.isArray(data)
        ) {

          if (
            data.length === 0
          ) {

            setCustomerLoan(
              null
            );

            setMessage(
              "No loan application found"
            );

            return;
          }

          setCustomerLoan(
            data[data.length - 1]
          );

        } else {

          setCustomerLoan(
            data
          );

        }

      } catch (error) {

        console.error(error);

        setMessage(
          "Unable to connect to the server"
        );

      }

    };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8fafc,#dbeafe)",
      }}
    >

      {/* CUSTOMER HEADER */}

      <div
        style={{
          backgroundColor:
            "#111827",

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
              className="btn btn-danger btn-sm"
              onClick={onLogout}
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </div>

      {/* MAIN */}

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

        {/* MESSAGE */}

        {message && (

          <div
            className="alert alert-info text-center"
          >
            {message}
          </div>

        )}

        {/* BUTTONS */}

        <div className="text-center mb-4">

          <button
            className="btn btn-primary btn-lg me-2"
            onClick={() => {

              setShowApply(true);

              setMessage("");

            }}
          >
            📝 Apply for Loan
          </button>

          <button
            className="btn btn-dark btn-lg"
            onClick={handleTrackLoan}
          >
            🔍 Track My Loan
          </button>

        </div>

        {/* APPLY FORM */}

        {showApply && (

          <div
            className="card shadow-lg border-0 p-5 mb-5"
          >

            <h2
              className="fw-bold text-center mb-4"
            >
              Loan Application
            </h2>

            <form
              onSubmit={handleSubmit}
            >

              <div className="row">

                {/* NAME */}

                <div
                  className="col-md-6 mb-3"
                >

                  <label className="form-label fw-semibold">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    className="form-control"
                    placeholder="Enter your name"
                    value={
                      loan.customerName
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* EMAIL */}

                <div
                  className="col-md-6 mb-3"
                >

                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={
                      loan.email
                    }
                    readOnly
                  />

                </div>

                {/* PHONE */}

                <div
                  className="col-md-6 mb-3"
                >

                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={
                      loan.phone
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* AMOUNT */}

                <div
                  className="col-md-6 mb-3"
                >

                  <label className="form-label fw-semibold">
                    Loan Amount
                  </label>

                  <input
                    type="number"
                    name="loanAmount"
                    className="form-control"
                    placeholder="Enter loan amount"
                    value={
                      loan.loanAmount
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* TYPE */}

                <div
                  className="col-md-6 mb-3"
                >

                  <label className="form-label fw-semibold">
                    Loan Type
                  </label>

                  <select
                    name="loanType"
                    className="form-select"
                    value={
                      loan.loanType
                    }
                    onChange={
                      handleChange
                    }
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
                    value={
                      loan.loanTerm
                    }
                    onChange={
                      handleChange
                    }
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

        )}
                {/* MY LOAN */}

        {customerLoan && (

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

            {/* STATUS */}

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

        )}

      </div>

    </div>

  );
}

export default App;