import { io } from "socket.io-client";

// Create Socket.IO connection with backend
const socket = io("http://localhost:8080", {
    withCredentials: true,
    autoConnect: true,
});

export default socket;