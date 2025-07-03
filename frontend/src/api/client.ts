import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:9999", // FastAPI backend
  withCredentials: false,
});

export default client;
