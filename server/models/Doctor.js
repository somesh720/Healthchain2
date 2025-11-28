import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    default: ""
  },
  contact: {
    type: String,
    default: ""
  },
  fullName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    default: ""
  },
  // Added gender field
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other"
  },
  consultationFee: {
    type: Number,
    default: 500
  },
  consultingDays: [{
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  }],
  consultingTimings: {
    startTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    }
  },
  address: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  zipCode: {
    type: String,
    default: ""
  },
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Add a pre-save hook to sync name and fullName
doctorSchema.pre('save', function(next) {
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }
  next();
});

export default mongoose.model("Doctor", doctorSchema);