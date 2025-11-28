import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";

/* ---------------------- 📄 Fetch Reports ---------------------- */
export const getReports = async (req, res) => {
  try {
    const { patientId, patientName } = req.query;

    // build query filter
    let filter = { file: { $ne: null } };
    if (patientId) {
      if (!mongoose.Types.ObjectId.isValid(patientId))
        return res.status(400).json({ message: "Invalid patientId" });
      filter.patientId = patientId.trim();
    } else if (patientName) {
      filter.patientName = patientName.trim();
    } else {
      return res
        .status(400)
        .json({ message: "Missing patientId or patientName" });
    }

    // ✅ Include file info and createdAt field in the response
    const reports = await Appointment.find(filter).select(
      "doctorName file fileId originalFileName date time reason phone createdAt"
    ).sort({ createdAt: -1 });

    console.log(`📄 Found ${reports.length} reports with creation dates`);
    
    res.json(reports);
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

/* ---------------------- 📄 Fetch Reports for Specific Doctor ---------------------- */
export const getDoctorSpecificReports = async (req, res) => {
  try {
    const { patientId, doctorId, doctorName } = req.query;

    if (!patientId) {
      return res.status(400).json({ message: "Missing patientId" });
    }

    // Build query filter for specific doctor
    let filter = { 
      patientId: patientId.trim(),
      file: { $ne: null }
    };

    // Add doctor filter if provided
    if (doctorId) {
      filter.doctorId = doctorId.trim();
    } else if (doctorName) {
      filter.doctorName = doctorName.trim();
    }

    console.log("🔍 Fetching doctor-specific reports with filter:", filter);

    // ✅ Include file info and createdAt field in the response
    const reports = await Appointment.find(filter).select(
      "doctorName file fileId originalFileName date time reason phone doctorId createdAt"
    ).sort({ createdAt: -1 });

    console.log(`📄 Found ${reports.length} reports for the specified doctor`);
    
    res.json(reports);
  } catch (error) {
    console.error("❌ Error fetching doctor-specific reports:", error);
    res.status(500).json({ message: "Failed to fetch doctor-specific reports" });
  }
};