import express from "express";
import { createUser, updateUser } from "../model/userModel.js";
import { hashPassword } from "../utility/bcryptHelper.js";
import { v4 as uuidv4 } from "uuid";
import { createSession, deleteSession } from "../model/sessionModel.js";
import { sendEmailVerification } from "../utility/nodeMailerHelper.js";

const userRouter = express.Router();

userRouter.post("/", async(req,res) =>{
    try {
        // Hash the plain password
        const { password } = req.body;
        const hashedPassword = hashPassword(password);

        // Create user in DB
        const user = await createUser({ ...req.body, password: hashedPassword });

        if(user?._id){

            // Generate unique identifier using uuid library
            const uniqueToken = uuidv4();

            // Create session to save the token for email verification
            const session = await createSession({
                userEmail: user.email,
                token: uniqueToken
            });

            if(session?._id){
                // Create a verification url
                const verificationUrl = `${process.env.CLIENT_ROOT_URL}/email-verification?email=${user.email}&token=${uniqueToken}`

                // Send verification email to user
                sendEmailVerification(user.email, verificationUrl);
            }
        
        }

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

// Verify user email endpoint 
userRouter.patch("/", async (req, res) => {
    try {
        // Fetch userEmail and token from req body
        const { userEmail, token } = req.body;

        // Check if session with email and token exists
        const session = await deleteSession({ userEmail, token });

        // if session with email and token exists proceed else return error response
        if(!session?._id){
            res.json({
                status: "error",
                message: "Invalid Verification Link!"
            })
            return;
        }

        // if valid link find and update the user
        const user = await updateUser({ email: session.userEmail }, { isEmailVerified: true })

        // send response back to user
        user?._id
            ? res.json({
                status: "success",
                message: "User verified successfully"
            })
            : res.json({
                status: "error",
                message: "Invalid Verification Link!!"
            });


        
    } catch (error) {
        res.json({
            status: "error",
            message: "Invalid Verification Link!!!"
        });
    }
})

export default userRouter;