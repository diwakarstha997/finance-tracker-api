import mongoose from "mongoose";
import sessionSchema from "../schema/sessionSchema.js";

const sessionModel = mongoose.model("session", sessionSchema);

// functions for model query operations

// create user session
export const createSession = (sessionObj) => {
    return sessionModel(sessionObj).save();
}