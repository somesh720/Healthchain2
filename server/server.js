import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// 📁 __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
  console.log('📁 Loading .env file');
} else if (fs.existsSync('.env.production')) {
  dotenv.config({ path: '.env.production' });
  console.log('📁 Loading .env.production file');
} else if (fs.existsSync('.env.development')) {
  dotenv.config({ path: '.env.development' });
  console.log('📁 Loading .env.development file');
} else {
  console.log('⚠️ No .env file found, using default values');
}

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
import gridFSRoutes from "./routes/gridFSRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',

  'https://healthchain-project.vercel.app', // Changed to your actual frontend

  'https://healthchain-project.vercel.app'

];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ ADD THESE 2 CRITICAL LINES - BODY PARSER MIDDLEWARE
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Routes - THESE WORK NOW BECAUSE BODY PARSER IS ADDED
app.post("/api/signup", registerUser);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/specialization", doctorSpecializationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/requests", appointmentManagementRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/auth", forgetpasswordRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", gridFSRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    gridfs: "Enabled",
    bodyParser: "Enabled" // Add this to confirm
  });
});

// Test endpoint to verify body parsing
app.post("/api/test-body", (req, res) => {
  console.log("Test request body:", req.body);
  res.json({
    message: "Body parsing works!",
    receivedBody: req.body
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 GridFS file storage enabled`);

  console.log(`📁 Body parser middleware enabled`);
});



