// Imports
import { Product } from "../models/product";
import path from "path";
import { NextFunction, Response, Request } from "express";


const ITEMS_PER_PAGE = 2;


/**
 * Create Product
 */
export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    //const imageUrl = req.body.imageUrl;
}

/**
 * Add to cart
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}