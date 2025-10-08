import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Card from "../components/Card";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({ tags, currentVideoId }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let url;

        if (tags && tags.length > 0) {
          // 🔹 Fetch related videos by tags
          const tagsQuery = tags.join(",");
          url = `http://localhost:8800/api/videos/tags?tags=${encodeURIComponent(
            tagsQuery
          )}&exclude=${currentVideoId}`;
        } else {
          // 🔹 Fallback: fetch all videos if no tags found
          console.log("No tags found — fetching all videos as recommendations.");
          url = `http://localhost:8800/api/videos/all`;
        }

        console.log("Fetching recommendations from:", url);
        const res = await axios.get(url);

        console.log("API Response Data:", res.data);
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch recommended videos:", err);
        setVideos([]);
      }
    };

    fetchVideos();
  }, [tags, currentVideoId]);

  return (
    <Container>
      {videos.length > 0 ? (
        videos.map((video) => (
          <Card type="sm" key={video._id} video={video} />
        ))
      ) : (
        <p>No recommendations available.</p>
      )}
    </Container>
  );
};

export default Recommendation;
