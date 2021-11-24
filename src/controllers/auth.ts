// imports
import { User, UserDocument, AuthToken } from "../models/user";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

/**
 * Login page.
 * POST /login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            const err = Error("A user with this email could not be found.")
            res.status(401)
            next(err)
        };
        loadedUser = user;
        const token = jwt.sign({
            email: user?.email,
            id: user?._id
        }, 'supersecret')
        user?.comparePassword(password, (err, isMatch) => {
            if (err) {
                const err = Error("The password doesn't match.");
                res.status(401);
                next(err)
            }

            if (isMatch) {
                res.status(200).json({tokens: token, userId: loadedUser._id.toString()})
                return
            }
        })
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        };
        next(err)
        return err
    };
};

/**
 *  Signup
 * POST /signup
 */
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        res.status(422)
        next(error)
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