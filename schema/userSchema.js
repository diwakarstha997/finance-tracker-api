import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: 1
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
}
)

export default userSchema;