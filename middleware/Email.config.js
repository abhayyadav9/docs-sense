import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Corrected SMTP host for Gmail
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "yadav45abhay@gmail.com",
    pass: "dykejvtkeryouhzm",
  },
});

const sendEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"abhay " <yadav45abhay@gmail.com>', // sender address
      to: "yadavabhay8227@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

