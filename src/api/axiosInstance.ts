import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://random-word-api.herokuapp.com",
  timeout: 10000, // Optional: Timeout after 5 seconds
});

export default axiosInstance;
