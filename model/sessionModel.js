import mongoose from "mongoose";
import sessionSchema from "../schema/sessionSchema.js";

const sessionModel = mongoose.model("session", sessionSchema);

// functions for model query operations

// create user session
export const createSession = (sessionObj) => {
    return sessionModel(sessionObj).save();
}

// delete user session: filter - used to find session
export const deleteSession = (filter) => {
    return sessionModel.findOneAndDelete(filter);
}

// Get Seesion: filter used to find specific data
export const getSession = (filter) => {
    return sessionModel.findOne(filter);
}