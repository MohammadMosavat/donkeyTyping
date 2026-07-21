import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://random-word-api.herokuapp.com",
  timeout: 10000,
});

export default axiosInstance;
