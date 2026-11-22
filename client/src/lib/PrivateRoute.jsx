import { Navigate, useLocation } from "react-router";
import auth from "./auth-helper.js";

// Week 9 slides: only show children when signed in, otherwise go to /signin.
// Assignment 3: pass adminOnly to also require the admin role.
const PrivateRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (adminOnly && !auth.isAdmin()) {
    return (
      <section className="form-card">
        <h2>Not authorized</h2>
        <p className="form-error">Only the admin can add, edit or delete records.</p>
      </section>
    );
  }
  return children;
};

export default PrivateRoute;
