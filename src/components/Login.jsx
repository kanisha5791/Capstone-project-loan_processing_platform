import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://capstone-project-loanprocessingplatform-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : "Invalid email or password"
        );
        setLoading(false);
        return;
      }
      console.log("LOGIN RESPONSE =", data);
      // Save JWT token

      localStorage.setItem("token", data.token);

      // Save logged-in user's email
      localStorage.setItem("email", data.email);

      // Save user's role
      localStorage.setItem("role", data.role);

      // Send login information to App.jsx
      onLogin(data);

    } catch (error) {
      console.error("Login Error:", error);
      setError("Unable to connect to the server");
    }

    setLoading(false);
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
        <div className="text-center mb-4">
          <div style={{ fontSize: "55px" }}>
            🏦
          </div>

          <h2 className="fw-bold">
            Admin Login
          </h2>

          <p className="text-muted">
            Digital Lending & Loan Processing
          </p>
        </div>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email
            </label>

            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* PASSWORD */}

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Password
            </label>

            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="btn btn-dark btn-lg w-100 mt-2"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;