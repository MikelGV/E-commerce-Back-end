import crypto from "crypto";
import passport from "passport";
import { User, UserDocument, AuthToken } from "../models/user";
import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import "../config/passport";
import { Callback, NativeError } from "mongoose";


/**
 * Login page.
 * GET /login
 */

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    // const errors = validationResult(req);
    // if (!errors) {
    //     const error = new Error("Validation failed.");
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error
    // }
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password

    try {
        const user = new User({
            email: email,
            username: username,
            password: password
        });
        const result = await user.save();
        res.status(201).json({ message: "User created!", userId: result._id })
    } catch (err) {
        // if (!err.statuscCode) {
        //     err.statuscCode = 500;
        // }
        // next(err)
    }
};