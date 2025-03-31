import express from "express";
import { createUser } from "../model/userModel.js";
import { hashPassword } from "../utility/bcryptHelper.js";

const userRouter = express.Router();

userRouter.post("/", async(req,res) =>{
    try {
        // Hash the plain password
        const { password } = req.body;
        const hashedPassword = hashPassword(password);

        // Create user in DB
        // const user = await createUser({ ...req.body, password: hashedPassword });
        const user = await createUser(req.body);
    
        user  
            ? res.json({
                status: "success",
                data: {},
                message: "User Created Successfully"
              })
            : res.json({
                status: "error",
                message: user
              })
            
    } catch (error) {
        res.json({
            status: "error",
            message: "User Creation Failed!!!"
        })
    }
})

export default userRouter;