import express from "express";
import { 
  uploadFile, 
  viewFile, 
  downloadFile, 
  getFileInfo, 
  deleteFile 
} from "../controllers/gridFSController.js";
import { upload } from "../middleware/gridFSMiddleware.js";

const router = express.Router();

// File routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/view/:filename", viewFile);
router.get("/download/:filename", downloadFile);
router.get("/info/:filename", getFileInfo);
router.delete("/delete/:filename", deleteFile);

export default router;