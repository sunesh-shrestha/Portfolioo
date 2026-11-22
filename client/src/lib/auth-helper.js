// Week 9 slides: save / read / clear the JWT in sessionStorage
import { signout } from "./api-auth.js";

const auth = {
  isAuthenticated() {
    if (typeof window == "undefined") return false;
    if (sessionStorage.getItem("jwt"))
      return JSON.parse(sessionStorage.getItem("jwt"));
    else return false;
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  },
  clearJWT(cb) {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    cb();
    signout().then(() => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
  // Assignment 3: true only when the signed-in user has role "admin"
  isAdmin() {
    const jwt = this.isAuthenticated();
    return jwt && jwt.user && jwt.user.role === "admin";
  },
};

export default auth;
