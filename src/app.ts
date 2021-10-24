import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";
import MongoStore from "connect-mongo";

import {MONGODB_URI, SESSION_SECRET} from "./util/secrets";
import { MONGODB_PASSWORD, SESSION_SECRETS } from "./noEnv";

import * as passportConfig from "./config/passport";


const app = express();
const monogoUrl = MONGODB_PASSWORD

mongoose.connect(monogoUrl).then(() => {
    console.log("Connected to mongodb!")
}).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`)
});

app.set("port", process.env.PORT || 4000);
app.use(session({
    resave: true,
    saveUninitialized:true,
    secret: SESSION_SECRETS,
}))

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
