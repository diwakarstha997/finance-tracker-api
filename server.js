import express from "express";

const app = express();
const PORT = 8000

// middleware
app.use(express.json())

app.listen(PORT, (error) => {
    error   
        ? console.log("Error:", error.message)
        : console.log(`Server started successfully at PORT:${PORT}`);
        
        
})