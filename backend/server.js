import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import extensionRoutes from "./routes/extensionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
// import path, { resolve } from "path";
import fileRoutes from "./routes/fileRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();

const _dirname = path.resolve();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/secure-file", fileRoutes);


/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/extensions", extensionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/extensions", extensionRoutes);

app.use(errorHandler);

app.use(express.static(path.join(_dirname, "frontend", "dist")));

app.use((req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
/* ---------- SOCKET.IO SETUP ---------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://taskhub-3-i600.onrender.com",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.set("io", io);

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



