import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import axios from "../utils/axios"; // ✅ Use centralized axios instance

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

export const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // ✅ Dynamic backend URL for images
  const backendURL =
    process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:8800";

  // ✅ Helper to get full image URL
  const getProfileImage = (imgPath) => {
    if (!imgPath) return `${backendURL}/profiles/default-profile.png`;
    if (imgPath.startsWith("http")) return imgPath;
    return `${backendURL}${imgPath}`;
  };

  // ✅ Fetch all comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchComments();
  }, [videoId]);

  // ✅ Add comment on Enter key
  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && newComment.trim() !== "") {
      try {
        const res = await axios.post(
          "/comments",
          { desc: newComment, videoId },
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        setComments([res.data, ...comments]);
        setNewComment("");
      } catch (err) {
        console.error("Failed to add comment:", err);
      }
    }
  };

  return (
    <Container>
      <NewComment>
        <Avatar
          src={getProfileImage(currentUser?.img)}
          alt={currentUser?.username || "User Avatar"}
        />
        <InputWrapper>
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </InputWrapper>
      </NewComment>

      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
