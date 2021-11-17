import mongoose, { Schema } from "mongoose";


export type ProductDocument = mongoose.Document & {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    userId: object;
}

const productSchema = new mongoose.Schema<ProductDocument>({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const Product = mongoose.model<ProductDocument>("Product", productSchema);