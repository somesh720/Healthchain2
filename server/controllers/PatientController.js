import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";

// ✅ Register Patient
export const registerPatient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      age,
      gender,
      bloodgroup,
      address,
      city,
      state,
      zipCode
    } = req.body;

    // Check if email exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new patient
    const patient = new Patient({
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

    await patient.save();
    res.status(201).json({
      message: "Patient registered successfully",
      patient,
    });
  } catch (error) {
    console.error("❌ Patient registration error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ✅ Login Patient
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // Convert to object and remove password
    const patientResponse = patient.toObject();
    delete patientResponse.password;

    res.status(200).json({
      message: "Login successful",
      patient: patientResponse,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Patient Profile
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Updating patient:", id);
    console.log("Update data:", updateData);

    // Find patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update fields
    const allowedFields = [
      'fullName',
      'email',
      'phone',
      'age',
      'gender',
      'bloodgroup',
      'address',
      'city',
      'state',
      'zipCode'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        patient[field] = updateData[field];
      }
    });

    // Save updated patient
    const updatedPatient = await patient.save();

    // Return the updated patient without password
    const patientResponse = updatedPatient.toObject();
    delete patientResponse.password;

    res.status(200).json({
      message: "Profile updated successfully",
      patient: patientResponse
    });

  } catch (error) {
    console.error("❌ Update patient error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Server error during update",
      error: error.message 
    });
  }
};