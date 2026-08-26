import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});
export const sendEmail = async ({
  email,
  subject,
  text,
}: {
  email: string;
  subject: string;
  text: string;
}) => {
  try {
    const mailOptions = {
      from: `Mi App ${process.env.USER}`,
      to: email,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email:", error);
    throw error;
  }
};
