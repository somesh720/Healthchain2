import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// Get all doctors grouped by specialization
router.get("/getDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();

    // Group doctors by specialization
    const grouped = doctors.reduce((acc, doc) => {
      if (!acc[doc.specialization]) acc[doc.specialization] = [];
      acc[doc.specialization].push(doc);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error });
  }
});

export default router;
