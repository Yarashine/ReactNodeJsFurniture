import mongoose from 'mongoose';

const ProductTypeSchema = new mongoose.Schema({
    designation: {
        type: String,
        required: true,
        unique: true,
    }
});

export default mongoose.model('ProductType', ProductTypeSchema);
