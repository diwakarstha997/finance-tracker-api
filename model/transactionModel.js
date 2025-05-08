import mongoose from "mongoose";
import transactionSchema from "../schema/transactionSchema.js";

const transactionModel = mongoose.model("transaction", transactionSchema);

// functions to perform operations with db

export const createTransaction = (transactionObj) => {
        return transactionModel(transactionObj).save();
}
