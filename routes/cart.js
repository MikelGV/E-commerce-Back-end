const router = require("express").Router();
const Cart = require("../models/Cart");
const {verifyToken, verifyTokenAndAuthorization} = require("./verifyToken");


// CREATE
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    };
});

// UPDATE CART
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params, {
            $set: req.body,
        }, {new: true});
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;