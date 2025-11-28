import express from "express";
import { registerUser } from "../controllers/AuthenticationController.js";

const router = express.Router();

// POST /api/signup
router.post("/signup", registerUser);

export default router;
