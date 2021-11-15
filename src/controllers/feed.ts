// Imports
import { Product } from "../models/product";
import path from "path";
import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
//import { IGetUserAuthInfoRequest } from "../types/default";
import { User } from "../models/user";

const ITEMS_PER_PAGE = 2;


/**
 * Create Product
 */
export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        res.send(422);
    };

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    //const imageUrl = req.file.path; example commit
    try {
        const product = new Product({
            title: title,
            price: price,
            description: description,
            userId: req.userId
        });
        const result = await product.save();
        res.status(201).json({message: "Product created", productId: result._id})
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

/**
 * Add to cart
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}