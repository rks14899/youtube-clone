import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Detect environment
const isProduction = process.env.NODE_ENV === "production";

// ✅ Set correct upload paths
const videoPath = isProduction ? "/tmp/videos" : "public/videos";
const thumbPath = isProduction ? "/tmp/thumbnails" : "public/thumbnails";

// ✅ Ensure folders exist (important for local & Render)
if (!fs.existsSync(videoPath)) fs.mkdirSync(videoPath, { recursive: true });
if (!fs.existsSync(thumbPath)) fs.mkdirSync(thumbPath, { recursive: true });

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, videoPath);
    else if (file.mimetype.startsWith("image/")) cb(null, thumbPath);
    else cb(new Error("Unsupported file type"), false);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    if (file.mimetype.startsWith("video/"))
      cb(null, `video-${uniqueSuffix}${ext}`);
    else if (file.mimetype.startsWith("image/"))
      cb(null, `thumbnail-${uniqueSuffix}${ext}`);
  },
});

// ✅ File filters
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed"), false);
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

// ✅ Multer instance (for both video & image)
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
