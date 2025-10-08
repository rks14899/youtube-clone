import axios from "../utils/axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import defaultChannelImg from "../img/logo.png";

const Container = styled.div`
  width: 100%;
  max-width: ${(props) => (props.type === "sm" ? "100%" : "360px")};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => (props.type === "sm" ? "flex" : "block")};
  gap: 10px;
`;

const Image = styled.img`
  width: ${(props) => (props.type === "sm" ? "180px" : "100%")};
  height: ${(props) => (props.type === "sm" ? "100px" : "202px")};
  background-color: #999;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => (props.type !== "sm" ? "16px" : "0")};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => (props.type === "sm" ? "none" : "block")};
  object-fit: cover;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 6px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

export default function Card({ type, video }) {
  const [channel, setChannel] = useState({});

  // ✅ Dynamic backend URL
  const backendURL =
    process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:8800";

  useEffect(() => {
    if (!video?.userId) return;

    const fetchChannel = async () => {
      try {
        const userId = video.userId?._id || video.userId;
        const res = await axios.get(`/users/find/${userId}`);
        setChannel(res.data);
      } catch (err) {
        console.error("Error fetching channel:", err);
      }
    };

    fetchChannel();
  }, [video?.userId]);

  // ✅ Updated to use backendURL
  const getProfileImage = (imgPath) => {
    if (!imgPath) return `${backendURL}/profiles/default-profile.png`;
    if (imgPath.startsWith("http")) return imgPath;
    return `${backendURL}${imgPath}`;
  };

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image
          type={type}
          src={
            video?.imgUrl
              ? `${backendURL}${video.imgUrl}`
              : defaultChannelImg
          }
          alt={video?.title || "Video thumbnail"}
        />
        <Details type={type}>
          <ChannelImage
            type={type}
            src={getProfileImage(channel?.img)}
            alt={channel?.username || "Channel image"}
          />
          <Texts>
            <Title>{video?.title}</Title>
            <ChannelName>{channel?.username || "Unknown Channel"}</ChannelName>
            <Info>
              {video?.views || 0} views •{" "}
              {video?.createdAt ? format(video.createdAt) : "Unknown date"}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
}
