import { useState } from "react";
import { Navigate, useLocation, Link } from "react-router";
import auth from "./auth-helper.js";
import { signin } from "./api-auth.js";

export default function Signin() {
  const location = useLocation();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const clickSubmit = (event) => {
    event.preventDefault();
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };
    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "", redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { from } = location.state || { from: { pathname: "/" } };
  if (values.redirectToReferrer) {
    return <Navigate to={from} />;
  }

  return (
    <section className="form-card">
      <h1>Sign In</h1>
      <form className="contact-form" onSubmit={clickSubmit}>
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
      <p>No account yet? <Link to="/signup">Sign up</Link></p>
    </section>
  );
}
