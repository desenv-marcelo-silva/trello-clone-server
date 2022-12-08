import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get("/", (req, res) => {
    res.send("API IS UP");
});

io.on('connection', () => {
    console.info("Socket.io connected!");
});
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/trelloclonedb").then(() => {
    console.log("Connected to mongodb");
    httpServer.listen(4001, () => {
        console.info("API is listening on port 4001");
    });
});

