import bcrypt from "bcryptjs";

// plain password to hased password using bcrypt
export const hashPassword = (plainPassword) => {
    const hashedPassword = bcrypt.hashSync(plainPassword, 15);

    return hashedPassword;
}