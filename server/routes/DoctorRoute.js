// routes/DoctorRoute.js
import express from "express";
import { 
  registerDoctor, 
  loginDoctor, 
  updateDoctor 
} from "../controllers/doctorController.js";

const router = express.Router();

// Doctor routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.put("/:id", updateDoctor);

export default router;