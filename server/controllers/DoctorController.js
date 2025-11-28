import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";

// ✅ Register Doctor
export const registerDoctor = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      specialization, 
      experience, 
      contact,
      gender,
      fullName,
      phone,
      consultationFee,
      consultingDays,
      consultingTimings,
      address,
      city,
      state,
      zipCode
    } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialization,
      experience,
      contact,
      gender: gender || "Other",
      fullName,
      phone,
      consultationFee,
      consultingDays,
      consultingTimings,
      address,
      city,
      state,
      zipCode
    });

    await doctor.save();
    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error("❌ Doctor registration error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ✅ Login Doctor
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // Convert to object and remove password
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    res.status(200).json({ 
      message: "Login successful", 
      doctor: doctorResponse 
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Doctor Profile
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Updating doctor:", id);
    console.log("Update data:", updateData);

    // Find doctor by ID
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update fields
    const allowedFields = [
      'name',
      'fullName', 
      'specialization',
      'experience',
      'contact',
      'phone',
      'email',
      'gender',
      'consultationFee',
      'consultingDays',
      'consultingTimings',
      'address',
      'city',
      'state',
      'zipCode'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        doctor[field] = updateData[field];
      }
    });

    // Sync name and fullName
    if (updateData.fullName && !updateData.name) {
      doctor.name = updateData.fullName;
    } else if (updateData.name && !updateData.fullName) {
      doctor.fullName = updateData.name;
    }

    // Save updated doctor
    const updatedDoctor = await doctor.save();

    // Return the updated doctor without password
    const doctorResponse = updatedDoctor.toObject();
    delete doctorResponse.password;

    res.status(200).json({
      message: "Profile updated successfully",
      doctor: doctorResponse
    });

  } catch (error) {
    console.error("❌ Update doctor error:", error);
    
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