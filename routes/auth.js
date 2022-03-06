const router = require("express").Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

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

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong credential");

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        const inputPassword = req.body.password;

        OriginalPassword !== inputPassword && res.status(401).json("Wrong password");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC, {expiresIn:"3d"});

        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router;