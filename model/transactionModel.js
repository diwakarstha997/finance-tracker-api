import mongoose from "mongoose";
import transactionSchema from "../schema/transactionSchema";

const transactionModel = mongoose.model("transaction", transactionSchema);

// functions to perform operations with db