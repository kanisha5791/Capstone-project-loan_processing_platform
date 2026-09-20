import { useState } from "react";

function CustomerRegister({ onRegister, onBackToLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
    const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setMessage(
        "Password must be at least 8 characters and contain uppercase, lowercase, number and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.text();

if (!response.ok) {
  setMessage(data || "Registration failed");
  setLoading(false);
  return;
}

      setMessage(
        "OTP sent to your email. Please verify."
      );

      setStep("otp");

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };
    const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/auth/verify-register-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        setMessage(
          data || "Invalid or expired OTP"
        );
        setLoading(false);
        return;
      }

      setMessage(
        "Registration successful! 🎉"
      );

      setTimeout(() => {
        onRegister();
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };
    const handleResendOtp = async () => {
    setResending(true);
    setMessage("");
    setOtp("");

    try {
      const response = await fetch(
        "http://localhost:8080/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data === "string"
            ? data
            : "Unable to resend OTP"
        );
        setResending(false);
        return;
      }

      setMessage("New OTP sent to your email.");

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }

    setResending(false);
  };
    if (step === "register") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#dbeafe",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "420px",
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          <h2 className="text-center fw-bold mb-4">
            👤 Customer Registration
          </h2>

          <form onSubmit={handleRegister}>
            <label className="form-label fw-semibold">
              Email
            </label>

            <input
              type="email"
              className="form-control form-control-lg mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="form-label fw-semibold">
              Password
            </label>

            <input
              type="password"
              className="form-control form-control-lg mb-3"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="form-label fw-semibold">
              Confirm Password
            </label>

            <input
              type="password"
              className="form-control form-control-lg mb-3"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            {message && (
              <div className="alert alert-info">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>

            <button
              type="button"
              className="btn btn-outline-dark btn-lg w-100 mt-3"
              onClick={onBackToLogin}
            >
              Back to Customer Login
            </button>
          </form>
        </div>
      </div>
    );
  }
    return (
    <div
      style={{
        minHeight: "100vh",
        background: "#dbeafe",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2 className="text-center fw-bold mb-4">
          🔐 Verify Registration
        </h2>

        <p className="text-center text-muted">
          OTP has been sent to
        </p>

        <p className="text-center fw-bold">
          {email}
        </p>

        <form onSubmit={handleVerifyOtp}>
          <label className="form-label fw-semibold">
            Enter OTP
          </label>

          <input
            type="text"
            className="form-control form-control-lg mb-3 text-center"
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
          />

          {message && (
            <div className="alert alert-info">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success btn-lg w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            className="btn btn-warning btn-lg w-100 mt-3"
            onClick={handleResendOtp}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>

          <button
            type="button"
            className="btn btn-outline-dark btn-lg w-100 mt-3"
            onClick={onBackToLogin}
          >
            Back to Customer Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;