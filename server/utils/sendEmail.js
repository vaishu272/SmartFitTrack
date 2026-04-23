import nodemailer from 'nodemailer';

export const sendEmail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"SmartFitTrack" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};