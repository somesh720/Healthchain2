import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

/**
 * ✅ GET /api/requests
 * Get all appointment requests for a specific patient or doctor
 * Example: /api/requests?patientId=123 OR /api/requests?doctorId=456
 */
router.get("/", async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;

    if (!patientId && !doctorId) {
      return res
        .status(400)
        .json({ message: "Patient ID or Doctor ID is required" });
    }

    const filter = patientId ? { patientId } : { doctorId };
    const requests = await Appointment.find(filter).sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
    res.status(500).json({ message: "Failed to fetch appointment requests" });
  }
});

/**
 * ✅ PUT /api/requests/:id/cancel
 * Cancel (mark as Cancelled) a specific appointment by either patient or doctor
 */
router.put("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment cancelled successfully", updated });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
});

/**
 * ✅ PUT /api/requests/:id/approve
 * Doctor approves the appointment (mark as Confirmed)
 */
router.put("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: "Confirmed" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res
      .status(200)
      .json({ message: "Appointment approved successfully", appointment: updated });
  } catch (error) {
    console.error("❌ Error approving appointment:", error);
    res.status(500).json({ message: "Failed to approve appointment" });
  }
});

/**
 * ✅ DELETE /api/requests/:id
 * Permanently delete an appointment (optional — for admin)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting appointment:", error);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
});

export default router;