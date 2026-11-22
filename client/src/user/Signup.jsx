import { useState } from "react";
import { Link } from "react-router";
import { create } from "./api-user.js";

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
  });
  const [open, setOpen] = useState(false); // shows the success message

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ name: "", email: "", password: "", error: "" });
        setOpen(true);
      }
    });
  };

  return (
    <section className="form-card">
      <h1>Sign Up</h1>
      {open ? (
        <div className="form-success">
          <h2>New Account</h2>
          <p>New account successfully created.</p>
          <Link to="/signin" className="button">Sign In</Link>
        </div>
      ) : (
        <form className="contact-form" onSubmit={clickSubmit}>
          <label>
            Name
            <input value={values.name} onChange={handleChange("name")} required />
          </label>
          <label>
            Email
            <input type="email" value={values.email} onChange={handleChange("email")} required />
          </label>
          <label>
            Password
            <input type="password" value={values.password} onChange={handleChange("password")} required />
          </label>
          {values.error && <p className="form-error">{values.error}</p>}
          <button type="submit" className="button">Submit</button>
        </form>
      )}
    </section>
  );
}
