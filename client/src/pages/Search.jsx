import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "../utils/axios"; // ✅ centralized axios instance
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // ✅ Use relative endpoint — baseURL handled by axios instance
        const res = await axios.get(`/videos/search${query}`);
        setVideos(res.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    fetchVideos();
  }, [query]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Search;
