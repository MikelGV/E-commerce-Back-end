import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error("Not authenticated");
        res.sendStatus(401);
        throw error
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'supersecret');
    } catch (err: any) {
        err.statuCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        res.sendStatus(401);
        throw error
    }
    req.userId = decodedToken.userId;
    next();
};