import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 📁 __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔧 Environment Variables Check:');
console.log('   PORT:', process.env.PORT);
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');

// Import routes
import appointmentManagementRoutes from "./routes/appointmentManagementRoutes.js";
import { registerUser } from "./controllers/AuthenticationController.js";
import doctorRoutes from "./routes/DoctorRoute.js";
import patientRoutes from "./routes/PatientRoute.js";
import doctorSpecializationRoutes from "./routes/DoctorSpecialization.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import forgetpasswordRoutes from "./routes/ForgetPasswordRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import gridFSRoutes from "./routes/gridFSRoutes.js"; // NEW: GridFS routes

const app = express();


// ✅ CORS for production - ADD THIS
// ✅ Allow multiple specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://your-frontend-app.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Routes
app.post("/api/signup", registerUser);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/specialization", doctorSpecializationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/requests", appointmentManagementRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/auth", forgetpasswordRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", gridFSRoutes); // NEW: GridFS file routes

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    gridfs: "Enabled"
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 GridFS file storage enabled`);
});