const router = require("express").Router();
const CryptoJs = require("crypto-js");
const User = require("../models/User");


// REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    });
    try {
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;