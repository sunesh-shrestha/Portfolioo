import { NavLink, useNavigate, useLocation } from "react-router";
import Logo from "./Logo.jsx";
import auth from "../lib/auth-helper.js";

// List of navigation links, so adding a page later only needs one new line
const navigationLinks = [
  { label: "Home", path: "/" },
  { label: "About Me", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Education", path: "/education" },
  { label: "Services", path: "/services" },
  { label: "Contact Me", path: "/contact" },
];

function Navbar() {
  const navigate = useNavigate();
  useLocation(); // re-render the navbar on every page change so sign in / out shows right away
  const jwt = auth.isAuthenticated();

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        <Logo />
        <span>Sunesh Prasad Shrestha</span>
      </NavLink>
      <nav>
        <ul className="navbar-links">
          {navigationLinks.map((link) => (
            <li key={link.path}>
              {/* NavLink automatically adds an "active" class to the current page */}
              <NavLink to={link.path} end={link.path === "/"}>
                {link.label}
              </NavLink>
            </li>
          ))}

          {/* Week 9 Menu: Sign Up / Sign In only when signed out */}
          {!jwt && (
            <>
              <li><NavLink to="/signup">Sign Up</NavLink></li>
              <li><NavLink to="/signin">Sign In</NavLink></li>
            </>
          )}

          {/* Messages + Sign Out only when signed in */}
          {jwt && (
            <>
              <li><NavLink to="/contacts">Messages</NavLink></li>
              <li className="navbar-user">
                {jwt.user.name} ({jwt.user.role})
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => {
                    auth.clearJWT(() => navigate("/"));
                  }}
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
