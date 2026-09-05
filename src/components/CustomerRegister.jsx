import { useState } from "react";

function CustomerRegister({ onRegister, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data === "string"
            ? data
            : "Registration failed"
        );
        setLoading(false);
        return;
      }

      setMessage("Registration successful!");

      setTimeout(() => {
        onRegister();
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };

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
            {loading ? "Registering..." : "Register"}
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