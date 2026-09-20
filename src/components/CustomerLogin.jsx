import { useState } from "react";

function CustomerLogin({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [mode, setMode] = useState("login");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // CUSTOMER LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Invalid email or password");
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      // =========================
      // NORMAL LOGIN
      // firstLogin = false
      // =========================

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);

        onLogin(data);

        setLoading(false);
        return;
      }

      // =========================
      // FIRST LOGIN
      // OTP REQUIRED
      // =========================

      setSuccess("OTP sent successfully to your email");
      setMode("loginOtp");

    } catch (error) {
      console.error("Login Error:", error);
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  // =========================
  // VERIFY LOGIN OTP
  // =========================

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/verify-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
            otp: otp,
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      if (data.role !== "CUSTOMER") {
        setError("This login is only for customers");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      onLogin(data);

    } catch (error) {
      console.error("OTP Error:", error);
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  // =========================
  // RESEND LOGIN OTP
  // =========================

  const handleResendLoginOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/resend-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Unable to resend OTP");
        setLoading(false);
        return;
      }

      setOtp("");
      setSuccess("New OTP sent successfully");

    } catch (error) {
      console.error("Resend OTP Error:", error);
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Unable to send OTP");
        setLoading(false);
        return;
      }

      setOtp("");
      setSuccess("Password reset OTP sent to your email");
      setMode("forgotOtp");

    } catch (error) {
      console.error("Forgot Password Error:", error);
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  // =========================
  // VERIFY FORGOT PASSWORD OTP
  // =========================

  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/verify-forgot-password-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp,
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      setSuccess("OTP verified successfully");
      setMode("resetPassword");

    } catch (error) {
      console.error("Forgot OTP Error:", error);
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Unable to reset password");
        setLoading(false);
        return;
      }

      setSuccess(
        "Password reset successfully. Please login."
      );

      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setMode("login");

    } catch (error) {
      console.error("Reset Password Error:", error);
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  // =========================
  // BACK TO LOGIN
  // =========================

  const backToLogin = () => {
    setMode("login");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8fafc,#dbeafe)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-5"
        style={{
          width: "420px",
          borderRadius: "20px",
        }}
      >

        {/* =========================
            LOGIN
        ========================= */}

        {mode === "login" && (
          <>
            <div className="text-center mb-4">

              <div style={{ fontSize: "55px" }}>
                👤
              </div>

              <h2 className="fw-bold">
                Customer Login
              </h2>

              <p className="text-muted">
                Login to apply and track your loan
              </p>

            </div>

            <form onSubmit={handleLogin}>

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                className="form-control form-control-lg mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              {/* FORGOT PASSWORD */}

              <div className="text-end mb-3">

                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => {
                    setMode("forgotEmail");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Forgot Password?
                </button>

              </div>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Customer Login"}
              </button>

            </form>

            <div className="text-center mt-4">

              <p className="text-muted mb-2">
                New customer?
              </p>

              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={onRegister}
              >
                Create New Customer Account
              </button>

            </div>
          </>
        )}

        {/* =========================
            LOGIN OTP
        ========================= */}

        {mode === "loginOtp" && (
          <>
            <div className="text-center mb-4">

              <div style={{ fontSize: "50px" }}>
                📧
              </div>

              <h3 className="fw-bold">
                Verify OTP
              </h3>

              <p className="text-muted">
                OTP sent to
              </p>

              <strong>
                {email}
              </strong>

            </div>

            <form onSubmit={handleVerifyLoginOtp}>

              <label className="form-label fw-semibold">
                Enter OTP
              </label>

              <input
                type="text"
                className="form-control form-control-lg text-center mb-3"
                placeholder="6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mb-3"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={handleResendLoginOtp}
                disabled={loading}
              >
                Resend OTP
              </button>

              <button
                type="button"
                className="btn btn-link w-100 mt-2"
                onClick={backToLogin}
              >
                Back to Login
              </button>

            </form>
          </>
        )}

        {/* =========================
            FORGOT PASSWORD EMAIL
        ========================= */}

        {mode === "forgotEmail" && (
          <>
            <div className="text-center mb-4">

              <div style={{ fontSize: "50px" }}>
                🔑
              </div>

              <h3 className="fw-bold">
                Forgot Password
              </h3>

              <p className="text-muted">
                Enter your registered email
              </p>

            </div>

            <form onSubmit={handleForgotPassword}>

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                className="form-control form-control-lg mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>

              <button
                type="button"
                className="btn btn-link w-100 mt-2"
                onClick={backToLogin}
              >
                Back to Login
              </button>

            </form>
          </>
        )}

        {/* =========================
            FORGOT PASSWORD OTP
        ========================= */}

        {mode === "forgotOtp" && (
          <>
            <div className="text-center mb-4">

              <div style={{ fontSize: "50px" }}>
                📧
              </div>

              <h3 className="fw-bold">
                Verify OTP
              </h3>

              <p className="text-muted">
                OTP sent to
              </p>

              <strong>
                {email}
              </strong>

            </div>

            <form onSubmit={handleVerifyForgotOtp}>

              <label className="form-label fw-semibold">
                Enter OTP
              </label>

              <input
                type="text"
                className="form-control form-control-lg text-center mb-3"
                placeholder="6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

              <button
                type="button"
                className="btn btn-link w-100 mt-2"
                onClick={backToLogin}
              >
                Back to Login
              </button>

            </form>
          </>
        )}

        {/* =========================
            RESET PASSWORD
        ========================= */}

        {mode === "resetPassword" && (
          <>
            <div className="text-center mb-4">

              <div style={{ fontSize: "50px" }}>
                🔐
              </div>

              <h3 className="fw-bold">
                Reset Password
              </h3>

              <p className="text-muted">
                Create your new password
              </p>

            </div>

            <form onSubmit={handleResetPassword}>

              <label className="form-label fw-semibold">
                New Password
              </label>

              <input
                type="password"
                className="form-control form-control-lg mb-3"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <label className="form-label fw-semibold">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control form-control-lg mb-3"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <small className="text-muted d-block mb-3">
                Password must contain at least 8 characters,
                uppercase, lowercase, number and special character.
              </small>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-success btn-lg w-100"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default CustomerLogin;