import crypto from "crypto";
import passport from "passport";
import { User, UserDocument, AuthToken } from "../models/user";
import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import "../config/passport";
import { Callback, NativeError } from "mongoose";
import { IVerifyOptions } from "passport-local";


/**
 * Login page.
 * POST /login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);
    await body("email").normalizeEmail({gmail_remove_dots: false}).run(req);

    passport.authenticate("local", (err: Error, user:UserDocument, info:IVerifyOptions) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            
        }
    })
}

/**
 *  Signup
 * POST /signup
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed.');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }
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
        console.log("something is not working")
        // if (!err.statusCode) {
        //   err.statusCode = 500;
        // }
        // next(err);
        
    }
};