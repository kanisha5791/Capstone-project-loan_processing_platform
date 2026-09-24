import { useEffect, useState } from "react";

function DocumentTable() {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://capstone-project-loanprocessingplatform-production.up.railway.app/documents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch documents");
        return;
      }

      const data = await response.json();

      // Group documents by customer email
      const grouped = {};

      data.forEach((document) => {
        if (!grouped[document.customerEmail]) {
          grouped[document.customerEmail] = {
            email: document.customerEmail,
            documents: [],
          };
        }

        grouped[document.customerEmail].documents.push(document);
      });

      setDocuments(Object.values(grouped));
    } catch (error) {
      console.error("Document Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // View document
  const viewDocument = (document) => {
    if (!document) {
      alert("Document not uploaded!");
      return;
    }

    window.open(
      `https://capstone-project-loanprocessingplatform-production.up.railway.app/documents/view/${document.id}`,
      "_blank"
    );
  };

  // Verify / Reject document
  const handleStatusChange = async (document, status) => {
    if (!document) {
      alert("Document not uploaded!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://capstone-project-loanprocessingplatform-production.up.railway.app/documents/${document.id}/status?status=${encodeURIComponent(
          status
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert(
          `${document.documentType} ${status} Successfully!`
        );

        fetchDocuments();
      } else {
        alert("Status update failed!");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Server Error!");
    }
  };

  // Find specific document
  const getDocument = (customerDocuments, type) => {
    return customerDocuments.find(
      (document) => document.documentType === type
    );
  };

  // Status badge
  const getStatusBadge = (document) => {
    if (!document) {
      return (
        <span className="badge bg-secondary">
          Not Uploaded
        </span>
      );
    }

    if (document.status === "Verified") {
      return (
        <span className="badge bg-success">
          Verified
        </span>
      );
    }

    if (document.status === "Rejected") {
      return (
        <span className="badge bg-danger">
          Rejected
        </span>
      );
    }

    return (
      <span className="badge bg-warning text-dark">
        Pending
      </span>
    );
  };

  return (
    <div className="container my-5">

      <div
        className="card shadow-lg border-0"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >

        {/* HEADER */}
        <div
          className="p-4 text-center"
          style={{
            background:
              "linear-gradient(135deg, #1d4ed8, #2563eb)",
            color: "white",
          }}
        >
          <h2 className="fw-bold mb-1">
            📄 Document Verification
          </h2>

          <p className="mb-0">
            Review and verify customer documents
          </p>
        </div>

        <div className="p-4">

          {documents.length > 0 ? (

            <div className="table-responsive">

              <table className="table align-middle">

                <thead className="table-light">

                  <tr>
                    <th className="text-center">
                      Customer
                    </th>

                    <th className="text-center">
                      Files
                    </th>

                    <th className="text-center">
                      Status
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {documents.map((customer) => {

                    const aadhaar = getDocument(
                      customer.documents,
                      "Aadhaar Card"
                    );

                    const pan = getDocument(
                      customer.documents,
                      "PAN Card"
                    );

                    const income = getDocument(
                      customer.documents,
                      "Income Proof"
                    );

                    const bank = getDocument(
                      customer.documents,
                      "Bank Statement"
                    );

                    return (
                      <tr key={customer.email}>

                        {/* CUSTOMER */}
                        <td className="text-center">

                          <div className="fw-bold">
                            👤 Customer
                          </div>

                          <small className="text-muted">
                            {customer.email}
                          </small>

                        </td>


                        {/* FILES */}
                        <td>

                          <div className="d-flex flex-column gap-2">

                            {/* Aadhaar */}
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                viewDocument(aadhaar)
                              }
                              disabled={!aadhaar}
                            >
                              📄 Aadhaar Card
                            </button>

                            {/* PAN */}
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                viewDocument(pan)
                              }
                              disabled={!pan}
                            >
                              📄 PAN Card
                            </button>

                            {/* Income */}
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                viewDocument(income)
                              }
                              disabled={!income}
                            >
                              📄 Income Proof
                            </button>

                            {/* Bank */}
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                viewDocument(bank)
                              }
                              disabled={!bank}
                            >
                              📄 Bank Statement
                            </button>

                          </div>

                        </td>


                        {/* STATUS */}
                        <td>

                          <div className="d-flex flex-column gap-2">

                            <div>
                              <strong>Aadhaar:</strong>{" "}
                              {getStatusBadge(aadhaar)}
                            </div>

                            <div>
                              <strong>PAN:</strong>{" "}
                              {getStatusBadge(pan)}
                            </div>

                            <div>
                              <strong>Income:</strong>{" "}
                              {getStatusBadge(income)}
                            </div>

                            <div>
                              <strong>Bank:</strong>{" "}
                              {getStatusBadge(bank)}
                            </div>

                          </div>

                        </td>


                        {/* ACTIONS */}
                        <td>

                          <div className="d-flex flex-column gap-2">

                            {/* Aadhaar Actions */}
                            <div className="d-flex gap-1">

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  viewDocument(aadhaar)
                                }
                                disabled={!aadhaar}
                              >
                                View
                              </button>

                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    aadhaar,
                                    "Verified"
                                  )
                                }
                                disabled={!aadhaar}
                              >
                                Verify
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    aadhaar,
                                    "Rejected"
                                  )
                                }
                                disabled={!aadhaar}
                              >
                                Reject
                              </button>

                            </div>


                            {/* PAN Actions */}
                            <div className="d-flex gap-1">

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  viewDocument(pan)
                                }
                                disabled={!pan}
                              >
                                View
                              </button>

                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    pan,
                                    "Verified"
                                  )
                                }
                                disabled={!pan}
                              >
                                Verify
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    pan,
                                    "Rejected"
                                  )
                                }
                                disabled={!pan}
                              >
                                Reject
                              </button>

                            </div>


                            {/* Income Actions */}
                            <div className="d-flex gap-1">

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  viewDocument(income)
                                }
                                disabled={!income}
                              >
                                View
                              </button>

                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    income,
                                    "Verified"
                                  )
                                }
                                disabled={!income}
                              >
                                Verify
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    income,
                                    "Rejected"
                                  )
                                }
                                disabled={!income}
                              >
                                Reject
                              </button>

                            </div>


                            {/* Bank Actions */}
                            <div className="d-flex gap-1">

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  viewDocument(bank)
                                }
                                disabled={!bank}
                              >
                                View
                              </button>

                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    bank,
                                    "Verified"
                                  )
                                }
                                disabled={!bank}
                              >
                                Verify
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleStatusChange(
                                    bank,
                                    "Rejected"
                                  )
                                }
                                disabled={!bank}
                              >
                                Reject
                              </button>

                            </div>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="text-center py-5">

              <div style={{ fontSize: "55px" }}>
                📂
              </div>

              <h5 className="mt-3 fw-bold">
                No Documents Found
              </h5>

              <p className="text-muted">
                Customer submitted documents will appear here.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default DocumentTable;