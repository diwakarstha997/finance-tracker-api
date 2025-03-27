import mongoose from "mongoose";
import userSchema from "../schema/userSchema.js";

const userModel = mongoose.model("user", userSchema);

// create user
export const createUser = (userObj) => {
    return userModel(userObj).save();
}