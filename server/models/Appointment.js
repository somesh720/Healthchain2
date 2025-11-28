import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  bloodgroup: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  file: {
    type: String, // GridFS filename
    required: false,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId, // GridFS file ID
    required: false,
  },
  originalFileName: {
    type: String, // Original uploaded filename
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
  // ADDED: Reference to prescription
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    default: null
  }
}, {
  timestamps: true,
});

export default mongoose.model("Appointment", appointmentSchema);