import crypto from "crypto";
import passport from "passport";
import { User, UserDocument, AuthToken } from "../models/user";
import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import "../config/passport";
import { Callback, NativeError } from "mongoose";


/**
 * Login page.
 * POST /login
 */


/**
 *  Signup
 * POST /signup
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
        const user = new User({
        email: email,
        password: password,
        name: name
        });
        const result = await user.save();
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
        
    }
};