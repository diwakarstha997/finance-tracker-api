import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
},
{
    timestamps: true
}
)

export default transactionSchema;