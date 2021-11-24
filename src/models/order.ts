import mongoose, {Schema} from "mongoose";

export type orderDocument = mongoose.Document & {
    products: any;
    user: any;
}

const orderSchema = new mongoose.Schema<orderDocument>({
    products: [{
        product: {type: Object, required: true},
        quantity: {type: Number, required: true}
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
})

export const Order = mongoose.model<orderDocument>("Order", orderSchema);