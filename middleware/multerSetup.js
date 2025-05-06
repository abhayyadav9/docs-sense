import cloudinary from "../database/cloudinary.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Define a Cloudinary storage configuration using a dynamic folder from req.uploadFolder,
// falling back to a default folder if not set.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: req.uploadFolder || "bikerent/default",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf"],
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    resource_type: "auto",
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// Customer upload middleware (remains unchanged)
export const customerUpload = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "dlimage", maxCount: 1 },
]);

// Retailer middleware to set the upload folder
export const retailerUpload = (req, res, next) => {
  req.uploadFolder = "bikerent/retailers";
  next();
};

// Retailer file upload middleware: only accept profilePic and storeImage fields
export const uploadRetailerFiles = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "storeImage", maxCount: 1 },
]);

// NEW: Vehicle middleware to set the upload folder for vehicles
export const vehicleUploadFolder = (req, res, next) => {
  req.uploadFolder = "bikerent/vehicles";
  next();
};

// NEW: Vehicle file upload middleware for multiple images (up to 5)
export const vehicleMultipleUpload = upload.array("vehicleImages", 5);
