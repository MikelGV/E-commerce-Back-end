import express, {Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import path from "path";
import session from "express-session";
import fs from "fs";
import MongoStore from "connect-mongo"
import csrf from "csurf"
import flash from "connect-flash";
import compression from "compression"
import dotenv from "dotenv";
import multer from "multer";

import { MONGODB_PASSWORD, SESSION_SECRETS } from "./noEnv";
import * as authController from "./controllers/auth";
import * as feedController from "./controllers/feed";
import isAuth from "./middleware/is-auth";

dotenv.config({path: '.env'});

const app = express();

const store = new MongoStore({
    mongoUrl: MONGODB_PASSWORD,
    collectionName: 'Session'
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toDateString() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(new Error('Only .jpeg, png or jpg files are accepted.'), false)
    }
};

// parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// Routes
app.post("/login", authController.login);
app.post("/logout", authController.logout);
app.post("/signup", authController.signup);
app.post("/addToCart",isAuth, feedController.addToCart);
app.post("/addProduct",isAuth, feedController.addProduct);
app.get("/products", isAuth, feedController.getProducts);

// multer, sessions and headers
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: SESSION_SECRETS,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
app.use(csrf());

app.set("port", process.env.PORT || 4000);

mongoose.connect(MONGODB_PASSWORD).then(() => {
    console.log("Connected to mongodb!")
}).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`)
});

export default app;
