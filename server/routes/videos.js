import express from "express";
import { getAllVideos, getByTag, search } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";
import { addVideo, addView, getVideo, random, sub, trend,getVideosByUser,updateVideo,deleteVideo} from "../controllers/video.js";
// import { uploadVideo } from "../Middleware/upload.js";
import { uploadFiles } from "../Middleware/upload.js";
const router = express.Router();

//create a video
router.post("/", uploadFiles, addVideo);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);
router.get("/find/:id", getVideo);
router.get("/user/:userId", getVideosByUser);
router.put("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub",verifyToken, sub);
router.get("/tags",getByTag);
router.get("/search", search);
router.get("/all", getAllVideos);

export default router;
