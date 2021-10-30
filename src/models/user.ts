import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose, { Schema } from "mongoose";

export type UserDocument = mongoose.Document & {
    email: string;
    username: string;
    password: string;
    cart: any;
    passwordResetToken: string;
    passwordResetExpires: Date;

    tokens: AuthToken[];

    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

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
    cart: [{
        items: {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    }]
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
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    var newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0 ) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        productId: product._id, 
        quantity: newQuantity 
      })
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  }
  
  userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  };
  
  userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
  }


export const User = mongoose.model<UserDocument>("User", userSchema);



