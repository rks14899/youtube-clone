import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => console.log("Connected to DB"))
    .catch((err) => {
      throw err;
    });
};

app.use(
  cors({
    origin: [
      "https://youtube-clone-frontend-6ikf.onrender.com", // ✅ your live frontend on Render
      "http://localhost:3000", // ✅ for local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Serve all static folders
app.use("/videos", express.static(path.join(__dirname, "public/videos")));
app.use(
  "/thumbnails",
  express.static(path.join(__dirname, "public/thumbnails"))
);
app.use("/profiles", express.static(path.join(__dirname, "public/profiles"))); // ✅ new line

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to Server!");
});
