import mongoose from "mongoose";

export const connectToMongoDb = () => {
    try {
        const connect = mongoose.connect(process.env.DB_CONNECT_URL);
        
        if(connect) {
            console.log("Database Connected:", process.env.DB_CONNECT_URL);
        } 
    } catch (error) {
        console.log("Error Connecting to Database:", error);
        
    }
}