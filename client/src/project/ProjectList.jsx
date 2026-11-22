import { useState, useEffect } from "react";
import { Link } from "react-router";
import auth from "../lib/auth-helper.js";
import { list, remove } from "./api-project.js";

// Lists the projects saved in MongoDB.
// Everyone can view. Admin also sees Add / Edit / Delete.
export default function ProjectList() {
  const [projects, setProjects] = useState([]);
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
        setProjects(data);
      }
    });
    return () => abortController.abort();
  }, []);

  const deleteProject = (projectId) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    remove({ projectId }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        // remove it from state so the list re-renders without a reload
        setProjects(projects.filter((p) => p._id !== projectId));
      }
    });
  };

  return (
    <div className="db-section">
      <div className="db-header">
        <h2 className="section-title">Project Records</h2>
        {auth.isAdmin() && (
          <Link to="/projects/new" className="button">+ Add Project</Link>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {projects.length === 0 && !error && <p>No projects saved yet.</p>}

      <div className="card-grid">
        {projects.map((project) => (
          <article className="card" key={project._id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p className="years">
              {project.firstname} {project.lastname} · {project.email}
              <br />
              Completed:{" "}
              {/* timeZone UTC so the date shows exactly as it was entered */}
              {project.completion
                ? new Date(project.completion).toLocaleDateString("en-CA", { timeZone: "UTC" })
                : "N/A"}
            </p>
            {auth.isAdmin() && (
              <div className="card-actions">
                <Link to={`/projects/edit/${project._id}`} className="button button-small">Edit</Link>
                <button className="button button-small button-danger" onClick={() => deleteProject(project._id)}>
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
