import express from "express";
import contactCtrl from "../controllers/contact.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// POST stays public so visitors can send the Contact Me form.
// Viewing messages needs sign-in (user = read only).
// Update / delete is admin only.
router.route("/api/contacts")
  .get(authCtrl.requireSignin, contactCtrl.list)
  .post(contactCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.removeAll);

router.route("/api/contacts/:contactId")
  .get(authCtrl.requireSignin, contactCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, contactCtrl.remove);

router.param("contactId", contactCtrl.contactByID);

export default router;
