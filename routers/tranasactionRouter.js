import express from "express"
import { verifyAccessJWT } from "../utility/jwtHelper.js";
import { findUserByEmail } from "../model/userModel.js";
import { createTransaction, deleteOneTransaction, fetchAllUserTransactions, fetchUserOneTransaction, findAndUpdateTransaction } from "../model/transactionModel.js";

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
transactionRouter.get("/fetch-transactions", async(req, res) => {
    try {
         // authenticate the user
        const { authorization } = req.headers;
        const decodedAccessJWT = await verifyAccessJWT(authorization);

        // if token not validated send error response
        if(!decodedAccessJWT.email){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if token validated find the user in database
        const user = await findUserByEmail(decodedAccessJWT.email);

        // if user doesnot exist send error response
        if(!user._id){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user is not verified sent eror response
        if(!user?.isEmailVerified){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user exists and verified fetch transactions
        const transactions = await fetchAllUserTransactions(user._id);

        // if transactions exist send succcess response
        if(transactions.length>0){
            res.json({
                status: "success",
                data: transactions
            })
        } else{
            // else send no transactions found
            res.json({
                status: "success",
                message: "No transaction records"
            })
        }
        
    } catch (error) {
        res.json({
            status: "error",
            message: "Error:"+error
        })
    }
   
})

// Fetch One Transaction | GET
transactionRouter.get("/:id", async(req, res) => {
    try {
        // authenticate the user
        const { authorization } = req.headers;
        const decodedAccessJWT = await verifyAccessJWT(authorization);

        // if token not validated send error response
        if(!decodedAccessJWT.email){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if token validated find the user in database
        const user = await findUserByEmail(decodedAccessJWT.email);

        // if user doesnot exist send error response
        if(!user._id){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user is not verified sent eror response
        if(!user?.isEmailVerified){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user exists and verified fetch transactions
        const transaction = await fetchUserOneTransaction({ userId: user._id, _id: req.params.id });

        // if transactions exist send succcess response
        if(transaction?._id){
            res.json({
                status: "success",
                data: transaction
            })
        } else{
            // else send no transactions found
            res.json({
                status: "success",
                message: "No transaction found"
            })
        }
        
    } catch (error) {
        res.json({
            status: "error",
            message: "Error:"+error
        })
    }
   
})

// Update Transaction | PATCH
transactionRouter.patch("/update-transaction", async(req, res) => {
    try {
        // authenticate user
        const { authorization } = req.headers;
        const decodedAccessJWT = verifyAccessJWT(authorization);

        // if token not validated send error response
        if(!decodedAccessJWT?.email){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if token validated find user in db
        const user = await findUserByEmail(decodedAccessJWT.email);

        // if user not found send error response
        if(!user?._id){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user is not verified sent eror response
        if(!user?.isEmailVerified){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user exists find transaction and send update query to database
        const transaction = await findAndUpdateTransaction(req.body)

        // if success send success response
        if(transaction?._id){
            res.json({
                status: "success",
                message: "Transaction Updated!!!",
                data: transaction
            })
        }
    } catch (error) {
        res.json({
            status: "error",
            message: "Error: "+error,
        })
    }
})

// Delete Transaction | DELETE
transactionRouter.delete("/:id", async(req, res) => {
    try {
        // authenticate user
        const { authorization } = req.headers;
        const decodedAccessJWT = verifyAccessJWT(authorization);

        // if token not validated send error response
        if(!decodedAccessJWT?.email){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if token validated find user in db
        const user = await findUserByEmail(decodedAccessJWT.email);

        // if user not found send error response
        if(!user?._id){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user is not verified sent eror response
        if(!user?.isEmailVerified){
            res.json({
                status: "error",
                message: "Invalid token!!!"
            })
        }

        // if user exists find transaction and send update query to database
        const transaction = await deleteOneTransaction(req.params.id)

        // if success send success response
        if(transaction?._id){
            res.json({
                status: "success",
                message: "Transaction Deleted!!!",
                data: transaction
            })
        }
    } catch (error) {
        res.json({
            status: "error",
            message: "Error: "+error,
        })
    }
})

export default transactionRouter;