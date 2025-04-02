import nodemailer from "nodemailer";

// configure transporter
const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

// Send Mail 
export const sendMail = async(mail) => {
    try {
        const response = transport.sendMail(mail);
        console.log(response?.messageId);
    } catch (error) {
        console.log("Error:", error);
    }
}