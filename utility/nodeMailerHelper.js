import { sendMail } from "../config/mailConfig.js";

// functions to send email

// send verification email for new registered users
export const sendEmailVerification = (email, verificationUrl) => {
    const emailObject = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email verification for your account",
        html: `
         <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h2 style="color: #333;">Email Verification</h2>
            <p style="color: #555; font-size: 16px;">Thank you for signing up with <strong>FinanceTracker</strong>! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="[Verification Link]" style="display: inline-block; padding: 12px 24px; margin: 20px 0; text-decoration: none; color: #ffffff; background-color: #007bff; border-radius: 5px; font-size: 16px;">Verify My Email</a>
            <p style="color: #555; font-size: 16px;">If the button doesn’t work, copy and paste the following link into your browser:</p>
            <p style="word-wrap: break-word;"><a href="[Verification Link]" style="color: #007bff; text-decoration: none;">${verificationUrl}</a></p>
            <p style="color: #555; font-size: 16px;">If you didn’t sign up for an account, you can safely ignore this email.</p>
            <div style="margin-top: 20px; font-size: 14px; color: #777;">
                <p>Best regards,</p>
                <p><strong>FinanceTracker</strong></p>
            </div>
        </div>
        `
    }
    sendMail(emailObject);
}