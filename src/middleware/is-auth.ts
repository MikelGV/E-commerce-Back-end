import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get['Authorization'];
    if (!authHeader) {
        const error = new Error("Not authenticated");
        res.status(401);
        next(error)
    }
    const token = authHeader?.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'supersecret');
    } catch (err: any) {
        err.statuCode = 500;
        next(err);
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        res.status(401);
        next(error)
    }
    req.userId = decodedToken.userId;
    next();
};