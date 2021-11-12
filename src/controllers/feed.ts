// Imports
import { Product } from "../models/product";
import path from "path";
import { NextFunction, Response, Request } from "express";


const ITEMS_PER_PAGE = 2;


/**
 * Create Product
 */
export const addProduct = async (req: Request, res: Response, next: NextFunction) => {}

/**
 * Add to cart
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}