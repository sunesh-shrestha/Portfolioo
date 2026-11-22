import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  message: String,
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Contact", ContactSchema);