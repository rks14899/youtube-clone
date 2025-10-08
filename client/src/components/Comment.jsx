import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js"; // ✅ import timeago.js

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});

  // ✅ helper for profile image
  const getProfileImage = (imgPath) => {
    if (!imgPath) return "http://localhost:8800/profiles/default-profile.png";
    if (imgPath.startsWith("http")) return imgPath;
    return `http://localhost:8800${imgPath}`;
  };

  useEffect(() => {
    const fetchCommentUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users/find/${comment.userId}`);
        setChannel(res.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setChannel({ username: "Unknown", img: "" });
      }
    };
    fetchCommentUser();
  }, [comment.userId]);

  return (
    <Container>
      <Avatar src={getProfileImage(channel?.img)} alt={channel?.username || "User"} />
      <Details>
        <Name>
          {channel?.username || "Unknown"}{" "}
          {/* ✅ Use timeago.js to show correct time */}
          <Date>{comment?.createdAt ? format(comment.createdAt) : ""}</Date>
        </Name>
        <Text>{comment?.desc}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
