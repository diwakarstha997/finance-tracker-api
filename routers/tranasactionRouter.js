import express from "express"

const transactionRouter = express.Router();

// Create Transaction | POST
transactionRouter.post('/create-transaction', (req, res) => {
    // Require authentication for user validation
    // get the user information to add transaction to respective user
    // add transaction to transaction table with valid user id
    // if success return 200
    // else return error
})

// Fetch All Transactions | GET
// Fetch One Transaction | GET
// Update Transaction | PATCH
// Delete Transaction | DELETE

export default transactionRouter;