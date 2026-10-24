import { io } from "socket.io-client";
import { API_URL } from "./config";

// Create Socket.IO connection with backend
const socket = io(API_URL, {
    withCredentials: true,
    autoConnect: true,
});

export default socket;