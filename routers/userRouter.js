import express from "express";
import { createUser } from "../model/userModel.js";

const userRouter = express.Router();

userRouter.post("/", async(req,res) =>{
    try {
        // Create user in DB
        const user = await createUser(req.body);

        user  
            ? res.json({
                status: "success",
                data: {},
                message: "User Created Successfully"
              })
            : res.json({
                status: "error",
                message: "User Creation Failed!!!"
              })
            
    } catch (error) {
        res.json({
            status: "error",
            message: "User Creation Failed!!!"
        })
    }
})

export default userRouter;