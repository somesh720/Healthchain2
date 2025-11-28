import express from "express";
import { 
  bookAppointment, 
  getAppointmentsByDoctor, 
  getDoctorPatients 
} from "../controllers/appointmentController.js";
import { getReports, getDoctorSpecificReports } from "../controllers/reportController.js";
import { upload } from "../middleware/gridFSMiddleware.js";

const router = express.Router();

// Book appointment with file upload
router.post("/book", upload.single("file"), bookAppointment);

// Get appointments by doctor ID
router.get("/doctor/:doctorId", getAppointmentsByDoctor);

// Get doctor's patients
router.get("/doctor/:doctorId/patients", getDoctorPatients);

// Get reports
router.get("/reports", getReports);

// Get doctor-specific reports
router.get("/doctor-reports", getDoctorSpecificReports);




// In your appointment routes file
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    console.log(`🔍 Fetching appointments for doctor: ${doctorId}`);

    const appointments = await Appointment.find({ doctorId: doctorId })
      .select('patientName patientId age gender phone date time status reason notes')
      .sort({ date: -1, time: -1 });

    console.log(`📄 Found ${appointments.length} appointments for doctor ${doctorId}`);

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ 
      message: 'Error fetching appointments',
      error: error.message 
    });
  }
});

export default router;