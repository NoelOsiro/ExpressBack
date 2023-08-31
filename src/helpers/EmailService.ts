import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import User, { IUser } from '../models/UserModel';

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    // Configure your email service here
});

// Function to send an email
const sendEmail = async (to:string, subject:string,templatePath:string, dynamicValues:any) => {
    const mailOptions = {
        from: 'your@example.com',
        to,
        subject,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendVerificationEmail = (user: IUser) => {
    const verificationLink = `http://your-backend-url/verify-email/${user.verificationToken}`;
    const emailSubject = 'Verify Your Email';

    sendEmail(user.email, emailSubject,'','');
};

export { sendVerificationEmail, sendEmail };
