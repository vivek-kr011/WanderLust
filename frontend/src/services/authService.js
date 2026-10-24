import axios from "axios";
import { API_URL } from "./config";

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await API.post("/signup", userData);
  return response.data;
};

export default API;