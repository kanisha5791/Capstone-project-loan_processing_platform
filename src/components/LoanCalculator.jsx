import { useState } from "react";

function LoanCalculator() {

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateLoan = () => {

    if (!loanAmount || !interestRate || !loanTerm) {
      return;
    }

    const principal = Number(loanAmount);

    const annualRate = Number(interestRate);

    const years = Number(loanTerm);

    const months = years * 12;

    const monthlyRate = annualRate / 12 / 100;

    const monthlyEMI =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = monthlyEMI * months;

    const interest = totalPayment - principal;

    setEmi(monthlyEMI);
    setTotalInterest(interest);
    setTotalAmount(totalPayment);
  };

  return (
    <div className="card shadow-lg border-0 p-5 mt-4">

      <h2 className="fw-bold text-center mb-4">
        🧮 Loan Calculator
      </h2>

      <div className="row">

        <div className="col-md-4 mb-3">

          <label className="form-label fw-semibold">
            Loan Amount (₹)
          </label>

          <input
            type="number"
            className="form-control"
            placeholder="Enter loan amount"
            value={loanAmount}
            onChange={(e) =>
              setLoanAmount(e.target.value)
            }
          />

        </div>

        <div className="col-md-4 mb-3">

          <label className="form-label fw-semibold">
            Interest Rate (%)
          </label>

          <input
            type="number"
            className="form-control"
            placeholder="Example: 10"
            value={interestRate}
            onChange={(e) =>
              setInterestRate(e.target.value)
            }
          />

        </div>

        <div className="col-md-4 mb-3">

          <label className="form-label fw-semibold">
            Loan Term (Years)
          </label>

          <input
            type="number"
            className="form-control"
            placeholder="Example: 2"
            value={loanTerm}
            onChange={(e) =>
              setLoanTerm(e.target.value)
            }
          />

        </div>

      </div>

      <div className="text-center mt-3">

        <button
          className="btn btn-primary btn-lg"
          onClick={calculateLoan}
        >
          Calculate EMI
        </button>

      </div>

      {emi > 0 && (

        <div className="row mt-5 text-center">

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm p-4">

              <h5 className="text-muted">
                Monthly EMI
              </h5>

              <h3 className="fw-bold text-primary">
                ₹ {emi.toFixed(2)}
              </h3>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm p-4">

              <h5 className="text-muted">
                Total Interest
              </h5>

              <h3 className="fw-bold text-danger">
                ₹ {totalInterest.toFixed(2)}
              </h3>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm p-4">

              <h5 className="text-muted">
                Total Repayment
              </h5>

              <h3 className="fw-bold text-success">
                ₹ {totalAmount.toFixed(2)}
              </h3>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default LoanCalculator;