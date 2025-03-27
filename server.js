import express from "express";
import cors from "cors"
import "dotenv/config"
import { connectToMongoDb } from "./config/dbConfig.js";

const app = express();
const PORT = process.env.SERVER_PORT;

// middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectToMongoDb();

app.listen(PORT, (error) => {
    error   
        ? console.log("Error:", error.message)
        : console.log(`Server started successfully at PORT:${PORT}`);
})