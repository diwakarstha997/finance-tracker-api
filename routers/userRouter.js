import express from "express";
import { createUser, findUserByEmail, updateUser } from "../model/userModel.js";
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import { v4 as uuidv4 } from "uuid";
import { createSession, deleteSession } from "../model/sessionModel.js";
import { sendEmailVerification } from "../utility/nodeMailerHelper.js";
import { generateJWT } from "../utility/jwtHelper.js";

const userRouter = express.Router();

// Sign Up new user | POST
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

// Login User | POST
userRouter.post("/login", async(req, res) => {
    try {
        // Extract email and password from body
        const { email, password } = req.body;

        // Find user in database else response with error
        const user = await findUserByEmail(email);

        if(!user?._id){
            res.json({
                status: "error",
                message: "Invalid Credentials!!"
            })
        }

        // Check if user is verified else response with error
        if(!user?.isEmailVerified){
            res.json({
                status: "error",
                message: "Please verify your account before login!!"
            })
        }
        // Compare password using bcrypt function 
        const isPasswordMatched = comparePassword( password, user.password );

        // if not matched resonse with error
        if(!isPasswordMatched){
            res.json({
                status: "error",
                message: "Invalid Credentials!!"
            })
        }

        // Generate Jwt token
        const jwt = generateJWT( user.email );

        // Save access token on session table
        const sessionStorage = await createSession({
            userEmail: user.email,
            token: jwt.accessJWT
        })

        // if saved successfully Response with success else response with error
        sessionStorage?._id
            ? res.json({
                status: "success",
                data: jwt,
                message: "Logged In Successfully"
            })
            : res.json({
                status: "error",
                message: "Invalid Credentials!!"
            })
        
    } catch (error) {
        // Error Response
        res.json({
            status: "error",
            message: `Invalid Credentials!!`
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