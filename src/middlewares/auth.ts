import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';

import { ExpressRequestInterface } from '../types/express-request.interface'
import UserModel from "../models/user";
import { secret } from '../config';

export default async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }
        const token = authHeader.split(' ')[1];
        const data = jwt.verify(token, secret) as { id: string; email: string };
        const user = await UserModel.findById(data.id);

        if (!user) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        req.user = user;
        next();
    } catch (error) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
}