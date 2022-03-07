const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");


const app = express();

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.DB;

mongoose.connect(MONGODB_URI,{useNewUrlParser: true}, () => {
    console.log("Connected to mongodb");
});

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(PORT || 500, () => {
    console.log("Backend is running");
});