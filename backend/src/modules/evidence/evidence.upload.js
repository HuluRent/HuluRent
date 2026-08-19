// Multipart upload validation (type/size) + push to object storage, returns file reference
const multer = require('multer');
const path = require('path');

// Configure local disk storage for evidence photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Note: Make sure an 'uploads/evidence' folder exists in your project root!
    cb(null, 'uploads/evidence/'); 
  },
  filename: (req, file, cb) => {
    // Generates a unique filename: fieldname-timestamp-random.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Security: Filter out non-image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed!'), false);
  }
};

// Initialize the upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter
});

module.exports = {
  // Configured to accept an array of up to 5 images under the field name 'evidencePhotos'
  uploadEvidence: upload.array('evidencePhotos', 5) 
};
