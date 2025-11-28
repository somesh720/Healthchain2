import mongoose from "mongoose";

// GridFS setup with better initialization
let gfs;

const initializeGridFS = () => {
  const conn = mongoose.connection;
  
  conn.once('open', () => {
    try {
      gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
      });
      console.log("✅ GridFS Bucket initialized");
    } catch (error) {
      console.error("❌ Failed to initialize GridFS:", error);
    }
  });
};

// Initialize GridFS
initializeGridFS();

// Helper function to ensure GridFS is ready
const getGridFS = () => {
  if (!gfs) {
    throw new Error('GridFS is not initialized. Please wait for MongoDB connection.');
  }
  return gfs;
};

// Helper function to get database connection
const getDB = () => {
  const conn = mongoose.connection;
  if (conn.readyState !== 1) {
    throw new Error('Database is not connected');
  }
  return conn.db;
};

/* ---------------------- 📤 Upload File to GridFS ---------------------- */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    console.log("✅ File uploaded to GridFS:", req.file.filename);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        id: req.file.id,
        size: req.file.size,
        mimetype: req.file.mimetype,
        metadata: req.file.metadata
      }
    });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    res.status(500).json({ 
      success: false,
      message: "File upload failed", 
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
    });
  }
};

/* ---------------------- 👀 View/Stream File ---------------------- */
export const viewFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ 
        success: false,
        message: "Filename is required" 
      });
    }

    console.log("🔍 Looking for file:", filename);
    
    const db = getDB();
    const files = await db.collection('uploads.files').find({ filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "File not found" 
      });
    }

    const file = files[0];
    const gridFS = getGridFS();
    
    // Set appropriate headers
    res.set("Content-Type", file.metadata?.mimeType || file.contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file.metadata?.originalName || filename}"`);
    res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

    // Stream file to response
    const downloadStream = gridFS.openDownloadStreamByName(filename);
    
    downloadStream.pipe(res);
    
    downloadStream.on('error', (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false,
          message: "Error streaming file" 
        });
      }
    });
    
  } catch (error) {
    console.error("❌ Error viewing file:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve file", 
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
    });
  }
};

/* ---------------------- 📥 Download File ---------------------- */
export const downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ 
        success: false,
        message: "Filename is required" 
      });
    }

    console.log("📥 Downloading file:", filename);
    
    const db = getDB();
    const files = await db.collection('uploads.files').find({ filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "File not found" 
      });
    }

    const file = files[0];
    const gridFS = getGridFS();
    
    // Set download headers
    res.set("Content-Type", file.metadata?.mimeType || file.contentType || "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="${file.metadata?.originalName || filename}"`);
    res.set("Content-Length", file.length);
    res.set("Cache-Control", "no-cache");

    // Stream file to response
    const downloadStream = gridFS.openDownloadStreamByName(filename);
    
    downloadStream.pipe(res);
    
    downloadStream.on('error', (error) => {
      console.error("Download stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false,
          message: "Error downloading file" 
        });
      }
    });
    
  } catch (error) {
    console.error("❌ Error downloading file:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to download file", 
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
    });
  }
};

/* ---------------------- 🔍 Get File Info ---------------------- */
export const getFileInfo = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ 
        success: false,
        message: "Filename is required" 
      });
    }

    const db = getDB();
    const files = await db.collection('uploads.files').find({ filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "File not found" 
      });
    }

    const file = files[0];
    
    res.json({
      success: true,
      file: {
        filename: file.filename,
        originalName: file.metadata?.originalName,
        uploadDate: file.uploadDate,
        length: file.length,
        contentType: file.metadata?.mimeType || file.contentType,
        metadata: file.metadata
      }
    });
  } catch (error) {
    console.error("❌ Error getting file info:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get file info", 
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
    });
  }
};

/* ---------------------- 🗑 Delete File ---------------------- */
export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ 
        success: false,
        message: "Filename is required" 
      });
    }

    const db = getDB();
    const files = await db.collection('uploads.files').find({ filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "File not found" 
      });
    }

    const gridFS = getGridFS();
    await gridFS.delete(files[0]._id);
    
    res.json({ 
      success: true,
      message: "File deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete file", 
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
    });
  }
};