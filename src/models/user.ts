import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose, { Schema } from "mongoose";
import { type } from "os";

export type UserDocument = mongoose.Document & {
    email: string;
    username: string;
    password: string;
    cart: cart[];
    passwordResetToken: string;
    passwordResetExpires: Date;

    tokens: AuthToken[];

    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;
type cart = {
    productId: object,
    quantity: number

}

export interface AuthToken {
    accessToken: string;
    kind: string;
};

const userSchema = new mongoose.Schema<UserDocument>({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        select: true
    },
    passwordResetToken: String,
    passwordResetExpires: String,
    tokens: Array,
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: {type: Number, required: true}
        }]
    }
});

/** 
 * Password hash middleware
*/
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) {return next();}
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {return next(err);}
        bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => { // TODO: I don't know but it can't have the parameter undefined
            if (err) {
                return next(err);
            };
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

/**
 *  Add to cart methods
 */

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    var newQuantity = 1;
    const updateCartItems = [...this.cart];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart[cartProductIndex].quantity + 1;
        updateCartItems[cartProductIndex].quantity = newQuantity
    } else {
        updateCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart: any = {
        cart: updateCartItems
    };
    this.cart = updatedCart;
    return this.save
};



export const User = mongoose.model<UserDocument>("User", userSchema);



