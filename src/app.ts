import express, {Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import path from "path";

import {MONGODB_URI, SESSION_SECRET} from "./util/secrets";
import { MONGODB_PASSWORD, SESSION_SECRETS } from "./noEnv";
import * as authController from "./controllers/auth";
import * as feedController from "./controllers/feed";

const app = express();
const monogoUrl = MONGODB_PASSWORD

app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect(monogoUrl).then(() => {
    console.log("Connected to mongodb!")
}).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`)
});

app.set("port", process.env.PORT || 4000);

// Routes
app.post("/login", authController.login);
app.post("/signup", authController.signup);
app.post("/addToCart", feedController.addToCart);
app.post("/addProduct", feedController.addProduct);
export default app;
