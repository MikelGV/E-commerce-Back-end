import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";

import {MONGODB_URI, SESSION_SECRET} from "./util/secrets";


const app = express();

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to mongodb!")
}).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`)
});

app.set("port", process.env.PORT || 4000);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
            //req.session.returnTo = req.path;
        } else if (req.user && req.path == "/account") {
            //req.session.returnTo = req.path
        }
        next();
});


export default app;
