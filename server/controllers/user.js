import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// Update user
export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      },
      { new : true}
    );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
    try {
        await User.findByIdAndDelete(
        req.params.id, 
    );
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};


// Get user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


// Subscribe
export const subscribe = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user.id, {
            $push:{subscribedUsers:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc:{ subscribers:1 },
        });
        res.status(200).json("Subscription successfull..")
    }catch(err){
        next(err)
    }
};

// Unsubscribe
export const unsubscribe =async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user.id, {
            $pull:{ subscribedUsers: req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc:{ subscribers: -1 },
        });
        res.status(200).json("Unsubscription successfull..")
    }catch(err){
        next(err)
    }
};

// Like a Video 
export const like = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },   // ek hi baar like ho
      $pull: { dislikes: userId },    // dislike remove ho jaye
    });
    res.status(200).json("The video has been liked 👍");
  } catch (err) {
    next(err);
  }
};

//  Dislike a video
export const dislike = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res.status(200).json("The video has been disliked 👎");
  } catch (err) {
    next(err);
  }
};