// Imports
import { Product } from "../models/product";
import path from "path";
import { NextFunction, Response, Request } from "express";


const ITEMS_PER_PAGE = 2;


export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}