import { useState, useEffect } from "react";
import { Link } from "react-router";
import auth from "../lib/auth-helper.js";
import { list, remove } from "./api-qualification.js";

// Lists the qualifications (education) saved in MongoDB.
// Everyone can view. Admin also sees Add / Edit / Delete.
export default function QualificationList() {
  const [qualifications, setQualifications] = useState([]);
  const [error, setError] = useState("");
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(signal).then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setError("");
        setQualifications(data);
      }
    });
    return () => abortController.abort();
  }, []);

  const deleteQualification = (qualificationId) => {
    if (!window.confirm("Delete this qualification? This cannot be undone.")) return;
    remove({ qualificationId }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        // remove it from state so the list re-renders without a reload
        setQualifications(qualifications.filter((p) => p._id !== qualificationId));
      }
    });
  };

  return (
    <div className="db-section">
      <div className="db-header">
        <h2 className="section-title">Qualification Records</h2>
        {auth.isAdmin() && (
          <Link to="/education/new" className="button">+ Add Qualification</Link>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {qualifications.length === 0 && !error && <p>No qualifications saved yet.</p>}

      <div className="card-grid">
        {qualifications.map((qualification) => (
          <article className="card" key={qualification._id}>
            <h3>{qualification.title}</h3>
            <p>{qualification.description}</p>
            <p className="years">
              {qualification.firstname} {qualification.lastname} · {qualification.email}
              <br />
              Completed:{" "}
              {/* timeZone UTC so the date shows exactly as it was entered */}
              {qualification.completion
                ? new Date(qualification.completion).toLocaleDateString("en-CA", { timeZone: "UTC" })
                : "N/A"}
            </p>
            {auth.isAdmin() && (
              <div className="card-actions">
                <Link to={`/education/edit/${qualification._id}`} className="button button-small">Edit</Link>
                <button className="button button-small button-danger" onClick={() => deleteQualification(qualification._id)}>
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
