import { useState, useEffect } from "react";
import { Navigate, useParams, Link } from "react-router";
import auth from "../lib/auth-helper.js";
import { create, read, update } from "./api-project.js";

// One form for both "Add Project" (/projects/new)
// and "Edit Project" (/projects/edit/:projectId)
export default function ProjectForm() {
  const { projectId } = useParams();
  const jwt = auth.isAuthenticated();

  const [values, setValues] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    completion: "",
    description: "",
    error: "",
    redirect: false,
  });

  // Edit mode: load the existing project into the form
  useEffect(() => {
    if (!projectId) return;
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({ projectId }, signal).then((data) => {
      if (data && data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({
          ...prev,
          error: "",
          title: data.title || "",
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          // <input type="date"> needs YYYY-MM-DD
          completion: data.completion ? data.completion.substring(0, 10) : "",
          description: data.description || "",
        }));
      }
    });
    return () => abortController.abort();
  }, [projectId]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    const project = {
      title: values.title || undefined,
      firstname: values.firstname || undefined,
      lastname: values.lastname || undefined,
      email: values.email || undefined,
      completion: values.completion || undefined,
      description: values.description || undefined,
    };

    const request = projectId
      ? update({ projectId }, { t: jwt.token }, project)
      : create({ t: jwt.token }, project);

    request.then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Navigate to="/projects" />;
  }

  return (
    <section className="form-card">
      <h1>{projectId ? "Edit Project" : "Add Project"}</h1>
      <form className="contact-form" onSubmit={clickSubmit}>
        <label>
          Title
          <input value={values.title} onChange={handleChange("title")} required />
        </label>
        <label>
          First Name
          <input value={values.firstname} onChange={handleChange("firstname")} required />
        </label>
        <label>
          Last Name
          <input value={values.lastname} onChange={handleChange("lastname")} required />
        </label>
        <label>
          Email
          <input type="email" value={values.email} onChange={handleChange("email")} required />
        </label>
        <label>
          Completion Date
          <input type="date" value={values.completion} onChange={handleChange("completion")} required />
        </label>
        <label>
          Description
          <textarea rows="4" value={values.description} onChange={handleChange("description")} required />
        </label>
        {values.error && <p className="form-error">{values.error}</p>}
        <div className="card-actions">
          <button type="submit" className="button">Submit</button>
          <Link to="/projects" className="button button-outline">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
