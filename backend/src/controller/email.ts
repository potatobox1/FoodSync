import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "foodsync9@gmail.com",
    pass: "blpq xtct yzba tvaw",
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: "foodsync9@gmail.com",
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};
