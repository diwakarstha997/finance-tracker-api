import mongoose from "mongoose";
import userSchema from "../schema/userSchema.js";

const userModel = mongoose.model("user", userSchema);

// create user
export const createUser = (userObj) => {
    return userModel(userObj).save();
}

// Find User by email
export const findUserByEmail = (email) => {
    return userModel.findOne({ email });
}

// verify user: filter - used to find user, updatedUser - user updated data
export const updateUser = (filter, updatedUser) => {
    return userModel
                .findOneAndUpdate(
                    filter, 
                    updatedUser, 
                    {   
                        // returns document update is applied
                        new: true
                    }
                );
}