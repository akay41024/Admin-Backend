import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
    comments: [{ type: String }]
});

module.exports = mongoose.model('Item', ItemSchema);
