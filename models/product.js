import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        unique: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    productUrl: {
        type: String,
        required: true,
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
    },
}, {
    timestamps: true,
});

export default mongoose.model('Product', ProductSchema);
