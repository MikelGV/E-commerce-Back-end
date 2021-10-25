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
    await check("email", "Email is not valid").isEmail().run(req);
    await check("username", "Username is not valid").run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min:4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        //req.flash("errors", errors.array());
        return res.redirect("/signup");
    }

    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password // i don't know why this fails
    });

    User.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
        if (err) {return next(err)}
        if (existingUser) {
            return res.redirect("/signup");
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.status(201).json({ message: "User created!", userId: user._id })
            });
        });
    })
};