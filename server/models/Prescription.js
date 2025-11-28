import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    // ADDED: Reference to appointment
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    },
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
    patientAge: {
      type: String,
      required: true,
    },
    patientGender: {
      type: String,
      required: true,
    },
    patientBloodGroup: {
      type: String,
      required: false,
    },
    patientPhone: {
      type: String,
      required: false,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    medicines: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        instructions: {
          type: String,
          default: "",
        },
      },
    ],
    tests: {
      type: [String],
      default: [],
    },
    advice: {
      type: String,
      default: "",
    },
    nextVisit: {
      type: Date,
      required: false,
    },
    prescriptionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;