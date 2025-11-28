import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";
import { handleGridFSUpload } from "../middleware/gridFSMiddleware.js";

export const bookAppointment = async (req, res) => {
  try {
    console.log("📥 Booking appointment...");
    
    let {
      doctorId,
      doctorName,
      patientId,
      patientName,
      age,
      gender,
      bloodgroup,
      phone,
      date,
      time,
      reason,
      notes,
    } = req.body;

    // Clean data
    if (doctorId) doctorId = doctorId.trim();
    if (patientId) patientId = patientId.trim();

    // Validate required fields
    if (!patientId || !doctorId || !date || !time || !reason) {
      return res.status(400).json({
        message: "Missing required fields: patientId, doctorId, date, time, reason"
      });
    }

    let fileData = null;
    
    // Handle file upload if exists
    if (req.file) {
      console.log("📁 Processing file upload...");
      
      try {
        const metadata = {
          patientId: patientId,
          doctorId: doctorId,
          patientName: patientName,
          doctorName: doctorName,
          appointmentDate: date,
          uploadedBy: 'patient'
        };

        fileData = await handleGridFSUpload(req.file, metadata);
        console.log("✅ File uploaded to GridFS:", fileData.filename);
      } catch (fileError) {
        console.error("❌ File upload failed:", fileError);
        // Continue without file - don't fail the entire appointment
      }
    }

    // Create and save appointment
    const appointment = new Appointment({
      doctorId: doctorId,
      doctorName: doctorName?.trim(),
      patientId: patientId,
      patientName: patientName?.trim(),
      age: age ? Number(age) : undefined,
      gender: gender?.trim(),
      bloodgroup: bloodgroup?.trim(),
      phone: phone?.trim(),
      date,
      time,
      reason,
      notes: notes || "",
      file: fileData ? fileData.filename : null,
      fileId: fileData ? fileData.fileId : null,
      originalFileName: fileData ? fileData.originalName : null,
      status: "Pending"
    });

    await appointment.save();
    console.log("✅ Appointment booked successfully");

    res.status(201).json({
      success: true,
      message: "✅ Appointment booked successfully!",
      appointment: {
        id: appointment._id,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        date: appointment.date,
        time: appointment.time,
        file: appointment.file ? true : false
      }
    });

  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/* ---------------------- 📋 Get Appointments by Doctor ID ---------------------- */
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    console.log("🔍 Fetching appointments for doctor:", doctorId);

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid doctor ID" 
      });
    }

    const appointments = await Appointment.find({ doctorId })
      .select("patientId patientName age gender status date time reason notes bloodgroup phone file fileId originalFileName createdAt")
      .sort({ createdAt: -1 });

    console.log(`📋 Found ${appointments.length} appointments for doctor ${doctorId}`);
    
    res.status(200).json({
      success: true,
      appointments: appointments
    });
  } catch (error) {
    console.error("❌ Error fetching doctor appointments:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch appointments",
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

/* ---------------------- 📂 Display Patient List ---------------------- */
export const getDoctorPatients = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid doctor ID" 
      });
    }

    // Fetch all appointments for that doctor
    const appointments = await Appointment.find({ doctorId })
      .select("patientId patientName age gender phone date time reason file fileId")
      .sort({ date: -1 });

    // Extract unique patients
    const uniquePatients = [];
    const patientMap = new Map();

    for (const appt of appointments) {
      if (!patientMap.has(appt.patientId)) {
        patientMap.set(appt.patientId, true);
        uniquePatients.push({
          patientId: appt.patientId,
          patientName: appt.patientName,
          date: appt.date,
          age: appt.age,
          gender: appt.gender,
          phone: appt.phone,
          time: appt.time,
          reason: appt.reason,
          file: appt.file,
          fileId: appt.fileId,
        });
      }
    }

    res.status(200).json({
      success: true,
      patients: uniquePatients
    });
  } catch (err) {
    console.error("Error fetching doctor patients:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch patients",
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
  }
};