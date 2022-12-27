import axios from "axios";

export const API = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api`,
  withCredentials: true,
});

// API.interceptors.request.use(function (config) {
//   config.headers.Authorization = token ? `Bearer ${token}` : "";
//   return config;
// });
