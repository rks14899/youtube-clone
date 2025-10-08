import multer from "multer";
import path from "path";

// Storage configuration for video and image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, "public/videos");
    else if (file.mimetype.startsWith("image/")) cb(null, "public/thumbnails");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    if (file.mimetype.startsWith("video/")) cb(null, "video-" + uniqueSuffix + ext);
    else if (file.mimetype.startsWith("image/")) cb(null, "thumbnail-" + uniqueSuffix + ext);
  },
});

// File filters
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed"), false);
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

// Multer instance for both video and image
export const uploadFiles = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) videoFilter(req, file, cb);
    else if (file.mimetype.startsWith("image/")) imageFilter(req, file, cb);
    else cb(new Error("Unsupported file type"), false);
  },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "img", maxCount: 1 },
]);
