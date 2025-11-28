import express from "express";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();


// Admin Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple admin authentication
    if (email === "admin@hospital.com" && password === "admin123") {
      const admin = {
        _id: "admin001",
        name: "System Administrator",
        email: email,
        role: "admin",
        createdAt: new Date()
      };

      res.json({
        message: "Admin login successful",
        admin: admin
      });
    } else {
      res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
});

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const doctorsCount = await Doctor.countDocuments();
    const patientsCount = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const cancelledAppointments = await Appointment.countDocuments({ status: "Cancelled" });
    const approvedAppointments = await Appointment.countDocuments({ status: "Confirmed" });
    const pendingAppointments = await Appointment.countDocuments({ status: "Pending" });

    res.json({
      doctors: doctorsCount,
      patients: patientsCount,
      totalAppointments,
      cancelled: cancelledAppointments,
      approved: approvedAppointments,
      pending: pendingAppointments
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

// Get all doctors for admin
router.get("/all-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Get all patients for admin
router.get("/all-patients", async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// Get all appointments for admin (simplified - using stored names)
router.get("/all-appointments", async (req, res) => {
  try {
    console.log("Fetching all appointments...");
    
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    console.log(`Found ${appointments.length} appointments`);
    
    // Since patientName and doctorName are already stored in the appointment,
    // we can just format the response directly
    const formattedAppointments = appointments.map(appointment => {
      console.log(`Appointment ${appointment._id}:`);
      console.log(`  Patient: ${appointment.patientName}`);
      console.log(`  Doctor: ${appointment.doctorName}`);
      console.log(`  Status: ${appointment.status}`);
      
      return {
        _id: appointment._id,
        patientName: appointment.patientName,
        patientId: appointment.patientId,
        doctorName: appointment.doctorName,
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        reason: appointment.reason,
        age: appointment.age,
        gender: appointment.gender,
        bloodgroup: appointment.bloodgroup,
        phone: appointment.phone,
        notes: appointment.notes,
        file: appointment.file,
        originalFileName: appointment.originalFileName,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt
      };
    });

    console.log("Formatted appointments ready to send");
    res.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// Get recent doctors
router.get("/recent-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("name email specialization profileImage createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching recent doctors:", error);
    res.status(500).json({ message: "Error fetching recent doctors" });
  }
});

// Get recent patients
router.get("/recent-patients", async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("name email phone profileImage createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(patients);
  } catch (error) {
    console.error("Error fetching recent patients:", error);
    res.status(500).json({ message: "Error fetching recent patients" });
  }
});

// Get recent appointments
router.get("/recent-appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .select("patientName doctorName date time status createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching recent appointments:", error);
    res.status(500).json({ message: "Error fetching recent appointments" });
  }
});

export default router;