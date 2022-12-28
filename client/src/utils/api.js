import axios from "axios";

export const API = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api`,
  withCredentials: true,
});
