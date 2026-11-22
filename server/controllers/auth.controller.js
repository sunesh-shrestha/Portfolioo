import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import User from "../models/user.model.js";
import config from "../config/config.js";

// POST /auth/signin  (Week 6 slides)
const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match." });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie("t", token, { expires: new Date(Date.now() + 9999000) });

    // role is sent back so the frontend knows whether to show admin buttons
    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" });
  }
};

// GET /auth/signout
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "signed out" });
};

// Checks for a valid JWT in the Authorization: Bearer header -> puts it on req.auth
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth"
});

// A signed-in user can only update/delete their own account
const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

// Assignment 3: only the admin can create / update / delete portfolio data.
// Same idea as hasAuthorization, but it checks the role saved in MongoDB.
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Admin access required" });
  }
};

export default { signin, signout, requireSignin, hasAuthorization, isAdmin };
