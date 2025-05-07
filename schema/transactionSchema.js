import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    description: {
        type: String,
    },
    transactionType: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    }
})

export default transactionSchema;