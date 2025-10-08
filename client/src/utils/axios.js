import axios from "../utils/axios";

const instance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://localhost:8800/api", // ✅ fallback for local
  withCredentials: true, // ✅ sends cookies / JWT tokens with every request
});

export default instance;

