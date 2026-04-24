require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger");
const Message = require("./src/models/message.model");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }
});

app.set("case sensitive routing", false);
app.set("io", io);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { url: "/docs/swagger.json" }
}));
app.get("/docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

/* ── SOCKET.IO ─────────────────────────────────────────────────── */
io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-chef",     () => socket.join("chefs"));
    socket.on("join-cashier",  () => socket.join("cashiers"));
    socket.on("join-admin",    () => socket.join("admins"));
    socket.on("join-kitchen",  () => { socket.join("kitchen");  console.log(`${socket.id} → kitchen`); });
    socket.on("join-delivery", () => { socket.join("delivery"); console.log(`${socket.id} → delivery`); });
    socket.on("join-support",  () => { socket.join("support");  console.log(`${socket.id} → support`); });
    socket.on("join-general",  () => { socket.join("general");  console.log(`${socket.id} → general`); });

    // Chat: xonaga qo'shilish (universal)
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    // Chat: xabar yuborish
    socket.on("send-message", async ({ room = "general", sender, text, avatar }) => {
        try {
            const msg = await Message.create({ room, sender, text, avatar });
            io.to(room).emit("receive-message", {
                _id: msg._id,
                room: msg.room,
                sender: msg.sender,
                text: msg.text,
                avatar: msg.avatar,
                createdAt: msg.createdAt,
            });
        } catch (err) {
            console.error("Message save error:", err.message);
        }
    });

    socket.on("disconnect", () => console.log("Disconnected:", socket.id));
});

const dashboardRoutes = require("./src/routes/dashboard.routes");

app.use("/api/auth",        require("./src/routes/auth.routes"));
app.use("/api/admin",       require("./src/routes/admin.routes"));
app.use("/api/food",        require("./src/routes/food.routes"));
app.use("/api/orders",      require("./src/routes/order.routes"));
app.use("/api/categories",  require("./src/routes/category.routes"));
app.use("/api/chef",        require("./src/routes/chef.routes"));
app.use("/api/reviews",     require("./src/routes/review.routes"));
app.use("/api/customers",   require("./src/routes/customer.routes"));
app.use("/api/wallet",      require("./src/routes/wallet.routes"));
app.use("/api/chat",        require("./src/routes/chat.routes"));
app.use("/api/events",      require("./src/routes/event.routes"));

app.use("/api/dashboard",   dashboardRoutes);
app.use("/api/Dashboard",   dashboardRoutes);

app.get("/", (req, res) => res.json({ msg: "Restaurant + Sedap API v2.0", port: 8001 }));
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));

server.listen(8001, () => console.log("Server: http://localhost:8001"));
