import axios from "axios";
//baseURL: "https://chabot-psicologia-web.onrender.com",
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  retry: false,
});

export default axiosInstance;
