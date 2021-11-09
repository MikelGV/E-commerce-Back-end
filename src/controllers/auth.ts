// External imports
import { User, UserDocument, AuthToken } from "../models/user";
import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import { Callback, NativeError } from "mongoose";

/**
 * Login page.
 * POST /login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const errors = validationResult(req);

}

/**
 *  Signup
 * POST /signup
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.'); // <---- I don't know why this doesn't work
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = new User({
            email: email,
            password: password,
            username: username
        });
        const result = await user.save();
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err: any) {
        console.log("something is not working")
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
        
    }
};