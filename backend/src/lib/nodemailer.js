import nodemailer from "nodemailer";

export const sendResetEmail = async (email, resetUrl) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️  EMAIL_USER or EMAIL_PASS missing in environment variables (backend/.env).");
      console.warn(`🔑 [DEV MODE] Password reset link for ${email}: ${resetUrl}`);
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // Works with Gmail. You will need to use an "App Password" if you have 2FA enabled.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Anva - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You requested to reset your password. Please click the button below to choose a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
