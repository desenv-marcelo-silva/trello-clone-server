import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';

import * as usersController from "./controllers/users";
import * as boardController from './controllers/boards';

import authMiddleware from "./middlewares/auth";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("toJSON", {
    virtuals: true,
    transform:(_, converted) => {
        delete converted._id;
    }
});

app.get("/", (req, res) => {
    res.send("API IS UP");
});

app.post("/api/users", usersController.register);
app.post("/api/users/login", usersController.login);
app.get("/api/user", authMiddleware, usersController.currentUser);
app.get('/api/boards', authMiddleware, boardController.getBoards);

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

