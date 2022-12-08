import { Request, Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { secret } from "../config";
import UserModel from '../models/user';
import { UserDocument } from "../types/user.interface";

const normalizeUser = (user: UserDocument) => {
    const { email, username, id } = user;
    const token = jwt.sign({ id, email }, secret)
    return {
        email,
        username,
        id,
        token
    }
}

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const newUser = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        const savedUser = await newUser.save();
        res.send(normalizeUser(savedUser));
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(messages);
        }
        next(error)
    }
}