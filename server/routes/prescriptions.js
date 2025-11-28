import express from "express";
import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";

const router = express.Router();

/* ---------------------- 📝 Create New Prescription ---------------------- */
router.post("/create", async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      doctorName,
      patientId,
      patientName,
      patientAge,
      patientGender,
      patientBloodGroup,
      patientPhone,
      diagnosis,
      symptoms,
      medicines,
      tests,
      advice,
      nextVisit,
    } = req.body;

    console.log("📝 Creating prescription for appointment:", appointmentId);
    console.log("📝 Patient ID:", patientId);

    // ✅ UPDATED: More flexible validation for patientId (can be string like FX6001)
    if (!appointmentId || !doctorId || !patientId || !diagnosis) {
      return res.status(400).json({
        message: "Appointment ID, Doctor ID, Patient ID, and Diagnosis are required",
      });
    }

    // ✅ UPDATED: Validate appointment exists (handle both ObjectId and string)
    let appointment;
    if (mongoose.Types.ObjectId.isValid(appointmentId)) {
      appointment = await Appointment.findById(appointmentId);
    } else {
      // If appointmentId is not a valid ObjectId, try finding by custom ID
      appointment = await Appointment.findOne({ _id: appointmentId });
    }

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Validate medicines
    if (!medicines || medicines.length === 0) {
      return res.status(400).json({
        message: "At least one medicine is required",
      });
    }

    // Check if prescription already exists for this appointment
    const existingPrescription = await Prescription.findOne({ appointmentId });
    if (existingPrescription) {
      return res.status(400).json({
        message: "Prescription already exists for this appointment",
      });
    }

    // Create new prescription
    const prescription = new Prescription({
      appointmentId,
      doctorId,
      doctorName,
      patientId, // This can be string like "FX6001"
      patientName,
      patientAge,
      patientGender,
      patientBloodGroup,
      patientPhone,
      diagnosis,
      symptoms: Array.isArray(symptoms) ? symptoms : [symptoms].filter(Boolean),
      medicines: Array.isArray(medicines) ? medicines : [],
      tests: Array.isArray(tests) ? tests : [tests].filter(Boolean),
      advice,
      nextVisit: nextVisit ? new Date(nextVisit) : null,
    });

    await prescription.save();

    // UPDATE: Link prescription to appointment
    await Appointment.findByIdAndUpdate(appointmentId, {
      prescriptionId: prescription._id,
      status: "Completed" // Mark appointment as completed
    });

    console.log("✅ Prescription created successfully for appointment:", appointmentId);

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: prescription,
    });
  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    res.status(500).json({
      message: "Failed to create prescription",
      error: error.message,
    });
  }
});

// ✅ CORRECTED: Check if prescription exists for specific appointment
router.get('/appointment/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    console.log(`🔍 Checking prescription for appointment: ${appointmentId}`);

    // ✅ UPDATED: More flexible appointmentId validation
    let prescription;
    if (mongoose.Types.ObjectId.isValid(appointmentId)) {
      prescription = await Prescription.findOne({ appointmentId });
    } else {
      // If appointmentId is not a valid ObjectId, try finding by string
      prescription = await Prescription.findOne({ appointmentId: appointmentId });
    }

    if (!prescription) {
      return res.json({ 
        exists: false, 
        prescription: null 
      });
    }

    res.json({ 
      exists: true, 
      prescription: prescription 
    });
  } catch (error) {
    console.error('Error checking prescription:', error);
    res.status(500).json({ 
      message: 'Error checking prescription',
      error: error.message 
    });
  }
});

// Get prescriptions by appointment ID (alternative format)
router.get('/by-appointment/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    let prescription;
    if (mongoose.Types.ObjectId.isValid(appointmentId)) {
      prescription = await Prescription.findOne({ appointmentId });
    } else {
      prescription = await Prescription.findOne({ appointmentId: appointmentId });
    }

    if (!prescription) {
      return res.json([]);
    }

    res.json([prescription]);
  } catch (error) {
    console.error('Error fetching prescription by appointment:', error);
    res.status(500).json({ 
      message: 'Error fetching prescription',
      error: error.message 
    });
  }
});

// ✅ CORRECTED: Get prescriptions for a patient (accepts string IDs like FX6001)
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`🔍 Fetching prescriptions for patient: ${patientId}`);

    // ✅ UPDATED: No strict validation - accept any string ID
    const prescriptions = await Prescription.find({ patientId })
      .populate('appointmentId', 'date time status')
      .sort({ createdAt: -1 })
      .exec();

    console.log(`📄 Found ${prescriptions.length} prescriptions for patient ${patientId}`);

    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({ 
      message: 'Error fetching prescriptions',
      error: error.message 
    });
  }
});

// ✅ CORRECTED: Get prescriptions by patient and doctor (accepts string IDs)
router.get('/patient/:patientId/doctor/:doctorId', async (req, res) => {
  try {
    const { patientId, doctorId } = req.params;

    console.log(`🔍 Checking prescriptions for patient ${patientId} and doctor ${doctorId}`);

    // ✅ UPDATED: No strict validation - accept any string IDs
    const prescriptions = await Prescription.find({
      patientId: patientId,
      doctorId: doctorId
    })
    .populate('appointmentId', 'date time status')
    .sort({ createdAt: -1 });

    console.log(`📄 Found ${prescriptions.length} prescriptions`);

    res.json(prescriptions);
  } catch (error) {
    console.error('Error checking prescriptions:', error);
    res.status(500).json({ 
      message: 'Error checking prescriptions',
      error: error.message 
    });
  }
});

// ✅ ADD THIS: Get appointments with prescription status for patient list
router.get('/appointments/prescription-status', async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({
        message: "Doctor ID is required"
      });
    }

    console.log(`🔍 Fetching appointments with prescription status for doctor: ${doctorId}`);

    const appointments = await Appointment.find({ doctorId: doctorId })
      .populate('prescriptionId', 'diagnosis createdAt')
      .select('patientName patientId age gender phone date time status prescriptionId')
      .sort({ date: -1, time: -1 });

    const formattedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      age: appointment.age,
      gender: appointment.gender,
      phone: appointment.phone,
      date: appointment.date,
      time: appointment.time,
      status: appointment.prescriptionId ? 'Completed' : appointment.status,
      hasPrescription: !!appointment.prescriptionId,
      prescriptionId: appointment.prescriptionId?._id
    }));

    console.log(`📄 Found ${formattedAppointments.length} appointments`);

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments with prescription status:', error);
    res.status(500).json({ 
      message: 'Error fetching appointments',
      error: error.message 
    });
  }
});

// ✅ ADD THIS: Simple health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Prescription routes are working',
    timestamp: new Date().toISOString()
  });
});

export default router;