import express from "express"
import { verifyAccessJWT } from "../utility/jwtHelper.js";
import { findUserByEmail } from "../model/userModel.js";
import { createTransaction } from "../model/transactionModel.js";

const transactionRouter = express.Router();

// Create Transaction | POST)
transactionRouter.post("/create-transaction", async (req, res) => {
    try {
        // Require authentication for user validation
        const { authorization } = req.headers;
        const decodedAccessJWT = verifyAccessJWT(authorization);
        
        // if token validation failed
        if(!decodedAccessJWT.email){
                res.json({
                    status: "error",
                    message: "Invalid Token!!!"
                });
        }

        // if token valdated
        // get the user information to add transaction to respective user
        const user =  await  findUserByEmail(decodedAccessJWT.email);
        
        // if user exist
        // add transaction to transaction table with valid user id
        if(user?._id && user?.isEmailVerified){
            // call the model method to save trasaction to db
            const transaction = await createTransaction({...req.body,userId: user._id});
            console.log(transaction);
            // if success return 200
            if(transaction?._id){
                res.json({
                    status: "success",
                    message: "Transaction created succesfully"
                });
            }
        }

        
    } catch (error) {
        res.json({
            status: "error",
            message: "Error:"+error
        });
    }
})

// Fetch All Transactions | GET
// Fetch One Transaction | GET
// Update Transaction | PATCH
// Delete Transaction | DELETE

export default transactionRouter;