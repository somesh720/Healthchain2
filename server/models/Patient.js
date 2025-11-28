// models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    role: { type: String, default: "patient" },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    bloodgroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;