import mongoose from "mongoose";
import transactionSchema from "../schema/transactionSchema.js";

const transactionModel = mongoose.model("transaction", transactionSchema);

// functions to perform operations with db

// create transaction
export const createTransaction = (transactionObj) => {
        return transactionModel(transactionObj).save();
}

// fetch all transactions of user
export const fetchAllUserTransactions = (userId) => {
    return transactionModel.find({ userId });
}

// fetch one transaction of user
export const fetchUserOneTransaction = (filter) => {
    return transactionModel.findOne({ ...filter });
}
