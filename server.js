import express from "express";
import cors from "cors"
import "dotenv/config"
import { connectToMongoDb } from "./config/dbConfig.js";
import userRouter from "./routers/userRouter.js";

const app = express();
const PORT = process.env.SERVER_PORT;

// middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectToMongoDb();

// Routers
app.use("/api/v1/users", userRouter);

app.listen(PORT, (error) => {
    error   
        ? console.log("Error:", error.message)
        : console.log(`Server started successfully at PORT:${PORT}`);
})