import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "../components/Card";
import axios from "axios";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Message = styled.div`
  grid-column: 1/-1;
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
  font-size: 18px;
`;

const Heading = styled.h2`
  grid-column: 1/-1;
  text-align: center;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

export default function Home({ type }) {
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(false);

        let url = "";
        let headers = {};

        if (type === "all") {
          url = "http://localhost:8800/api/videos/all";
          headers = {}; // No auth needed
        } else if (type === "user" && currentUser?._id) {
          url = `http://localhost:8800/api/videos/user/${currentUser._id}`;
          headers = { Authorization: `Bearer ${currentUser.token}` };
        } else if (type === "sub" && currentUser?._id) {
          url = `http://localhost:8800/api/videos/subscriptions/${currentUser._id}`;
          headers = { Authorization: `Bearer ${currentUser.token}` };
        } else {
          setVideos([]);
          setLoading(false);
          return;
        }

        console.log("Fetching videos:", type, "URL:", url);

        const res = await axios.get(url, { headers });
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(true);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [type, currentUser, dispatch, navigate]);

  if (loading) return <Message>Loading videos...</Message>;
  if (error) return <Message>Failed to load videos. Try again later.</Message>;
  if (!videos.length) return <Message>No videos found.</Message>;

  return (
    <Container>
      {type === "all" && <Heading>Explore All Videos</Heading>}
      {videos.map((video) => (
        <Card key={video._id} video={video} type={type} />
      ))}
    </Container>
  );
}
