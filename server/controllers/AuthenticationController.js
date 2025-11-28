import bcrypt from "bcryptjs";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

export const registerUser = async (req, res) => {
  try {
    const {
      role,
      fullName,
      email,
      password,
      phone,
      address,
      city,
      state,
      zipCode,
      specialization,
      experience,
      bloodgroup,
      gender,
      age,
      // ✅ New doctor fields
      consultationFee,
      consultingDays,
      consultingTimings
    } = req.body;

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === "doctor") {
      // Check if doctor already exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ message: "Doctor already registered." });
      }

      // ✅ Create doctor with all required fields including new ones
      newUser = new Doctor({
        fullName,
        email,
        password: hashedPassword,
        phone,
        specialization,
        experience,
        address,
        city,
        gender,
        state,
        zipCode,
        // ✅ New required fields with defaults
        consultationFee: consultationFee || 500,
        consultingDays: consultingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        consultingTimings: consultingTimings || {
          startTime: "09:00 AM",
          endTime: "05:00 PM"
        }
      });
    } else if (role === "patient") {
      // Check if patient already exists
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(400).json({ message: "Patient already registered." });
      }

      newUser = new Patient({
        fullName,
        email,
        password: hashedPassword,
        phone,
        age,
        gender,
        bloodgroup,
        address,
        city,
        state,
        zipCode,
      });
    } else {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    await newUser.save();
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser._doc;
    
    res.status(201).json({ 
      message: `${role} registered successfully!`, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors
      });
    }
    
    res.status(500).json({ message: "Server error during signup." });
  }
};