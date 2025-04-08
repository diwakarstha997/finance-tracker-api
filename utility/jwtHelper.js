import jwt from "jsonwebtoken";

// Generate Access JWT
export const generateAccessJWT = (email) => {
    const accessJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
    return accessJWT;
} 

// Generate Refresh JWT
export const generateRefreshJWT = (email) => {
    const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d"} )
    return refreshJWT;
}

// Verify Access JWT
export const verifyAccessJWT = (accessJWT) => {
    return jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET);
}

// Verify Refresh JWT
export const verifyRefreshJWT = (refreshJWT) => {
    return jwt.verify(refreshJWT, process.env.JWT_REFRESH_SECRET);
}