require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Make io accessible to routes
app.set("io", io);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* SOCKET.IO EVENTS */
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Join chef room when chef logs in
    socket.on("join-chef", () => {
        socket.join("chefs");
        console.log("Chef joined room - socket ID:", socket.id);
    });
    
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

/* ROUTES */
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/foods", require("./src/routes/food.routes"));
app.use("/api/orders", require("./src/routes/order.routes"));
app.use("/api/categories", require("./src/routes/category.routes"));

app.get("/", (req, res) => {
    res.json({ msg: "API running 🚀" });
});

/* 404 */
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
});

/* DB - MongoDB Atlas (Cloud) */
// const mongoUri = process.env.MONGO_URI || "mongodb+srv://user:password@cluster0.mongodb.net/restaurant?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

console.log(process.env.MONGO_URI);


server.listen(6000, () => console.log("Server 6000")); 