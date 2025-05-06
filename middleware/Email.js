import { transporter } from "./Email.config.js";
import { Reset_Password_Email_Template, Verification_Email_Template, Welcome_Email_Template } from "./EmailTemplate.js";

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"DocSense " <yadav45abhay@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify Your Email", // Subject line
      text: " ", // plain text body
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ), // html body
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log(first);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"DocSense 👻" <yadav45abhay@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};


export const sendResetCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"DocSense " <yadav45abhay@gmail.com>', // sender address
      to: email, // recipient email
      subject: "Your Password Reset Code", // Subject line
      text: `Your password reset code is: ${verificationCode}`, // plain text body
      html: Reset_Password_Email_Template.replace("{verificationCode}", verificationCode), // HTML email body
    });
    console.log("Password reset code email sent successfully");
  } catch (error) {
    console.error("Error sending reset code email:", error);
  }
};
