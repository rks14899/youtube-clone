import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden; /* ✅ Prevent body scroll shift */
  padding: 20px;
`;

const Modal = styled.div`
  width: 480px;
  max-width: 95%;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 22px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden; /* ✅ Stop horizontal content movement */
  box-sizing: border-box;

  /* ✅ Smooth scroll + consistent layout */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.soft} transparent;

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px 12px;
    border-radius: 10px;
    max-height: 85vh;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.soft};
    border-radius: 3px;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: ${({ theme }) => theme.textSoft};
  transition: 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 22px;
  margin-top: 5px;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Input = styled.input`
  border: 1.5px solid
    ${({ theme }) => (theme.bg === "#181818" ? "#3a3a3a" : "#d0d0d0")};
  background-color: ${({ theme }) =>
    theme.bg === "#181818" ? "#202020" : "#fafafa"};
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  padding: 10px 12px;
  width: 100%;
  font-size: 14px;
  margin-top: 5px;
  transition: border-color 0.25s ease, background-color 0.25s ease;

  &:focus {
    border-color: #3ea6ff;
    outline: none;
    background-color: ${({ theme }) =>
      theme.bg === "#181818" ? "#121212" : "#fff"};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSoft};
  }
`;

const Desc = styled.textarea`
  border: 1.5px solid
    ${({ theme }) => (theme.bg === "#181818" ? "#3a3a3a" : "#d0d0d0")};
  background-color: ${({ theme }) =>
    theme.bg === "#181818" ? "#202020" : "#fafafa"};
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  padding: 10px 12px;
  width: 100%;
  font-size: 14px;
  resize: vertical;
  min-height: 90px;
  margin-top: 5px;
  transition: border-color 0.25s ease, background-color 0.25s ease;

  &:focus {
    border-color: #3ea6ff;
    outline: none;
    background-color: ${({ theme }) =>
      theme.bg === "#181818" ? "#121212" : "#fff"};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSoft};
  }
`;


const Button = styled.button`
  border-radius: 5px;
  border: none;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  background-color: #065fd4;
  color: white;
  font-size: 15px;
  margin-top: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0049a8;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

function UploadModal({ setOpen }) {
  const [video, setVideo] = useState(null);
  const [img, setImg] = useState(null);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", video);
    formData.append("img", img);
    formData.append("title", inputs.title);
    formData.append("desc", inputs.desc);
    formData.append("tags", tags);
    formData.append("userId", currentUser._id);

    try {
      const res = await axios.post(
        "http://localhost:8800/api/videos",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setOpen(false);
        navigate(`/video/${res.data._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return createPortal(
    <Overlay>
      <Modal>
        <Close onClick={() => setOpen(false)}>×</Close>
        <Title>Upload a New Video</Title>

        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          name="desc"
          rows={8}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <Button onClick={handleUpload}>Upload</Button>
      </Modal>
    </Overlay>,
    document.body
  );
}

export default UploadModal;
