import express from "express";
import { registerPatient, loginPatient, updatePatient } from "../controllers/PatientController.js";
import Patient from "../models/Patient.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.put("/:id", updatePatient); // Add this line

// Add this to your patients route file
router.get("/test-patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    console.log("📋 Patient data from database:", patient);
    res.json(patient);
  } catch (error) {
    console.error("❌ Error fetching patient:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;