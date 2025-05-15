import express from "express";
import { createUser, findUserByEmail, updateUser } from "../model/userModel.js";
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import { v4 as uuidv4 } from "uuid";
import { createSession, deleteSession, getSession } from "../model/sessionModel.js";
import { sendEmailVerification } from "../utility/nodeMailerHelper.js";
import { generateAccessJWT, generateJWT, verifyAccessJWT, verifyRefreshJWT } from "../utility/jwtHelper.js";

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


// GET User Endpoint | GET
userRouter.get("/", async (req, res) => {
    try {
        // Verify jwt access token
        const { authorization } = req.headers;
        
        const decodedAccessJWT = verifyAccessJWT(authorization);
        
        // if invalid error response
        if(!decodedAccessJWT?.email){
            res.json({
                status: "error",
                message: "Invalid Token!!!"
            });
          }

          // if valid check session
          const session = await getSession({
              userEmail: decodedAccessJWT.email,
              token: authorization
            })

        // if token does not exist error response
        if(!session?._id){
            res.json({
                status: "error",
                message: "Invalid Token!!!"
            });
        }

        // if valid get user
        const user = await findUserByEmail(decodedAccessJWT.email);
        
        // get user if user send user data in response
        if(user?._id && user?.isEmailVerified){
            user.password = undefined
            res.json({
                status: "sucess",
                data: user
            })
        }
            
        } catch (error) {
            res.json({
                status: "error",
                message: "Invalid Token!!!"
        });
    }
})

// Generate new Access Jwt using Refresh Jwt
userRouter.get("/accessjwt", async (req, res) => {
    try {
        // verify jwt refresh token
        const { authorization } = req.headers;
        
        const decodedRefreshJWT = verifyRefreshJWT(authorization);
        
        console.log(decodedRefreshJWT);
    
        if(!decodedRefreshJWT?.email){
            res.json({
                status: "error",
                message: "Invalid Token!!!"
            })
        }
        
        // Get user from database
        const user = await findUserByEmail(decodedRefreshJWT.email);
    
        if(user?.id && user?.isEmailVerified){
            
            // Generate new access JWT
            const accessJWT = generateAccessJWT(user.email);
            
            // store generated access JWT in session table
            const sessionStorage = await createSession({ userEmail: user.email, token: accessJWT });
            
            sessionStorage?._id
            ? res.json({
                    status: "success",
                    data: accessJWT
                })
                : res.json({
                    status: "error",
                    data: "Invalid Token!!!"
                })
            }
        } catch (error) {
            res.json({
                status: "error",
                data: "Invalid Token!!!"
            })
    }
})

// Logout user | POST
userRouter.post("/logout", async (req, res) => {
    try {
        // verify access jwt
        const { authorization } = req.headers;
        
        const decodedAccessJWT =  verifyAccessJWT(authorization);
        
        if(!decodedAccessJWT?.email){
            res.json({
                status: "error",
                message: "Invalid Token!!!"
            })
        }
        
        // check session storage if token exists
        const sessionObj = {
            userEmail: decodedAccessJWT.email, 
            token: authorization
        }
        const session = await getSession(sessionObj);
        
        if(!session?._id){
            res.json({
                status: "error",
                message: "Invalid Token!!!"
            })
        }
        
        // if valid token get user from database
        const user = await findUserByEmail(decodedAccessJWT.email);
        
        if(user?.email && user?.isEmailVerified){
            // delete session
            await deleteSession(sessionObj);
            
            res.json({
                status: "success",
                message: "User Logged Out Successfully"
            })
        }
        
    } catch (error) {
        res.json({
            status: "error",
            message: "Invalid Token!!!"+error
        })
    }
})


export default userRouter;