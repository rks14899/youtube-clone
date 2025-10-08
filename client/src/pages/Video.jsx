import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import Recommendation from "../components/Recommendation";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription, logout } from "../redux/userSlice";

const Container = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;
const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;
const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #3ea6ff;
  }

  svg {
    font-size: 20px;
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;
const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;
const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;
const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;
const ChannelName = styled.span`
  font-weight: 500;
`;
const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;
const Description = styled.p`
  font-size: 14px;
`;
const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: #a21600;
  }
`;
const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!path) return;
      setLoading(true);

      try {
        const videoRes = await axios.get(
          `http://localhost:8800/api/videos/find/${path}`,
          { withCredentials: true }
        );

        const userId = videoRes.data.userId?._id || videoRes.data.userId;

        const channelRes = await axios.get(
          `http://localhost:8800/api/users/find/${userId}`,
          { withCredentials: true }
        );

        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        console.error("Failed to fetch video/channel data:", err);
        setChannel({
          name: "Unknown",
          img: "/default-profile.png",
          subscribers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, dispatch]);

  // ✅ LIKE / DISLIKE HANDLERS
  // ✅ LIKE HANDLER
  const handleLike = async () => {
    try {
      await axios.put(
        `http://localhost:8800/api/users/like/${currentVideo._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser?.token || ""}`,
          },
        }
      );
      dispatch(like(currentUser._id));
    } catch (err) {
      console.error("Like failed:", err.response?.data || err.message);
    }
  };

  // ✅ DISLIKE HANDLER
  const handleDislike = async () => {
    try {
      await axios.put(
        `http://localhost:8800/api/users/dislike/${currentVideo._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser?.token || ""}`,
          },
        }
      );
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error("Dislike failed:", err.response?.data || err.message);
    }
  };

  const handleSub = async () => {
    try {
      if (currentUser?.subscribedUsers?.includes(channel?._id)) {
        await axios.put(
          `http://localhost:8800/api/users/unsub/${channel._id}`,
          {},
          { withCredentials: true }
        );
      } else {
        await axios.put(
          `http://localhost:8800/api/users/sub/${channel._id}`,
          {},
          { withCredentials: true }
        );
      }
      dispatch(subscription(channel._id));
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  if (loading || !currentVideo)
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        Loading video...
      </div>
    );

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame
            src={`http://localhost:8800${currentVideo?.videoUrl}`}
            controls
          />
        </VideoWrapper>

        <Title>{currentVideo?.title || "Untitled"}</Title>
        <Details>
          <Info>
            {currentVideo?.views || 0} views •{" "}
            {currentVideo?.createdAt ? format(currentVideo.createdAt) : ""}
          </Info>

          {/* ✅ LIKE/DISLIKE/SHARE/SAVE SECTION */}
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currentVideo?.likes?.length || 0}
            </Button>

            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              Dislike
            </Button>

            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>

            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>

        <Hr />
        <Channel>
          <ChannelInfo>
            <Image
              src={
                channel?.img
                  ? `http://localhost:8800${channel.img}`
                  : "http://localhost:8800/profiles/default-profile.png"
              }
            />
            <ChannelDetail>
              <ChannelName>{channel?.name || "Unknown Channel"}</ChannelName>
              <ChannelCounter>
                {channel?.subscribers || 0} subscribers
              </ChannelCounter>
              <Description>{currentVideo?.desc || ""}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser?.subscribedUsers?.includes(channel?._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>

      <Recommendation
        tags={currentVideo?.tags || []}
        currentVideoId={currentVideo?._id}
      />
    </Container>
  );
};

export default Video;
