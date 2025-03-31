import bcrypt from "bcryptjs";

// plain password to hased password using bcrypt
export const hashPassword = (plainPassword) => {
    const hashedPassword = bcrypt.hashSync(plainPassword, bcrypt.genSalt(15));

    return hashedPassword;
}