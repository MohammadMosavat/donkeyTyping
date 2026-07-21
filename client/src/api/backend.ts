import axios from "axios";

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

backendApi.interceptors.request.use((config) => {
  const token =
    typeof window === "undefined" ? null : localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default backendApi;
