import { useState, useEffect } from "react";
import { Navigate, useParams, Link } from "react-router";
import auth from "../lib/auth-helper.js";
import { read, update } from "./api-contact.js";

// /contacts/edit/:contactId - admin edits a saved contact message
export default function ContactForm() {
  const { contactId } = useParams();
  const jwt = auth.isAuthenticated();

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
    error: "",
    redirect: false,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({ contactId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({
          ...prev,
          error: "",
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          message: data.message || "",
        }));
      }
    });
    return () => abortController.abort();
  }, [contactId]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    const contact = {
      firstname: values.firstname || undefined,
      lastname: values.lastname || undefined,
      email: values.email || undefined,
      message: values.message || undefined,
    };
    update({ contactId }, { t: jwt.token }, contact).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Navigate to="/contacts" />;
  }

  return (
    <section className="form-card">
      <h1>Edit Contact</h1>
      <form className="contact-form" onSubmit={clickSubmit}>
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
          Message
          <textarea rows="4" value={values.message} onChange={handleChange("message")} required />
        </label>
        {values.error && <p className="form-error">{values.error}</p>}
        <div className="card-actions">
          <button type="submit" className="button">Submit</button>
          <Link to="/contacts" className="button button-outline">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
