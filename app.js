const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRouter = require("./routes/user");


const app = express();

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.DB;

mongoose.connect(MONGODB_URI,{userNewUrlParser: true}, () => {
    console.log("Connected to mongodb");
});


app.use("/api/users", userRouter);

app.listen(PORT, () => {
    console.log("Backend is running");
});