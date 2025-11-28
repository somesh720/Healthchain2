import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple and reliable multer configuration
const storage = multer.memoryStorage();

const allowedMimes = [
  'application/pdf',
  'image/jpeg', 
  'image/jpg',
  'image/png',
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, JPG, PNG files are allowed.'), false);
  }
};

// Create upload middleware - THIS WILL WORK
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

console.log("✅ Upload middleware loaded successfully");

// GridFS file handler (for storing files in MongoDB)
export const handleGridFSUpload = async (file, metadata = {}) => {
  try {
    const conn = mongoose.connection;
    
    // Wait for MongoDB connection if not ready
    if (conn.readyState !== 1) {
      await new Promise(resolve => conn.once('open', resolve));
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });

    const filename = `file_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    return new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          ...metadata,
          originalName: file.originalname,
          mimeType: file.mimetype,
          uploadDate: new Date(),
          size: file.size
        }
      });

      uploadStream.end(file.buffer);
      
      uploadStream.on('finish', () => {
        resolve({
          filename: filename,
          fileId: uploadStream.id,
          originalName: file.originalname
        });
      });
      
      uploadStream.on('error', (error) => {
        reject(new Error(`GridFS upload failed: ${error.message}`));
      });
    });
  } catch (error) {
    throw new Error(`GridFS upload failed: ${error.message}`);
  }
};

// Export the upload middleware
export { upload };