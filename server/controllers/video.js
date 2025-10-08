import Video from "../models/Video.js";
import User from "../models/User.js"; // for sub() function
import { createError } from "../error.js"; 
import mongoose from "mongoose";


// Add video
export const addVideo = async (req, res, next) => {
  try {
    const videoFile = req.files?.video?.[0];
    const imgFile = req.files?.img?.[0];

    if (!videoFile) return res.status(400).json({ message: "Video file is required!" });

    const newVideo = new Video({
      userId: req.body.userId,
      title: req.body.title,
      desc: req.body.desc,
      videoUrl: `/videos/${videoFile.filename}`, // ✅ video file path
      imgUrl: imgFile ? `/thumbnails/${imgFile.filename}` : null, // ✅ image file path
      tags: req.body.tags ? req.body.tags.split(",") : [],
    });

    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    console.error("Upload Error:", err);
    next(err);
  }
};


// Fetch single video with uploader info
export const getVideo = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid video ID" });

    const video = await Video.findById(req.params.id).populate("userId", "name");
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

// Fetch all videos with uploader info
export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name");
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// Trending videos
export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find()
      .sort({ views: -1 })
      .populate("userId", "name");
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// Random videos
export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 5 } }]);
    const videosWithUser = await Video.populate(videos, { path: "userId", select: "name" });
    res.status(200).json(videosWithUser);
  } catch (err) {
    next(err);
  }
};

// Subscribed channels
export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found"));

    const subscribedChannels = user.subscribedUsers || [];

    const list = await Promise.all(
      subscribedChannels.map((channelId) =>
        Video.find({ userId: channelId }).populate("userId", "name")
      )
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

// Get videos by tags
export const getByTag = async (req, res, next) => {
  try {
    const { tags, exclude } = req.query;

    if (!tags)
      return res.status(400).json({ message: "Tags query parameter is required" });

    const tagsArray = tags.split(",");
    const filter = { tags: { $in: tagsArray } };

    if (exclude) filter._id = { $ne: exclude };

    const videos = await Video.find(filter).limit(20).populate("userId", "name");
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// Search videos
export const search = async (req, res, next) => {
  try {
    if (!req.query.q)
      return res.status(400).json({ message: "Search query is required" });

    const query = req.query.q;
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    })
      .limit(40)
      .populate("userId", "name");
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// Get videos by user
export const getVideosByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const videos = await Video.find({ userId }).populate("userId", "name");
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// Add view count
export const addView = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid video ID" });

    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.status(200).json("The view has been increased");
  } catch (err) {
    next(err);
  }
};

// Update a video
export const updateVideo = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid video ID" });

    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId.toString()) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

// Delete a video
export const deleteVideo = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid video ID" });

    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId.toString()) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};
