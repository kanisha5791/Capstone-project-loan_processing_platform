import { useState } from "react";

function CustomerLogin({ onLogin, onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

<<<<<<< HEAD
        if (!email || !password) {
            setError("Please enter email and password");
            return;
=======
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
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
>>>>>>> 4cecbce (Update customer login and registration)
        }

        setLoading(true);
        setError("");

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
            console.error(error);
            setError("Unable to connect to server");
        }

        setLoading(false);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#f8fafc,#dbeafe)",
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
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="form-label fw-semibold">
                        Password
                    </label>

                    <input
                        type="password"
                        className="form-control form-control-lg mb-3"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Customer Login"}
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
            </div>
        </div>
    );
}

export default CustomerLogin;