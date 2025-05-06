
import jwt from "jsonwebtoken";

const generateTokenAndSetCookies = (userId, res) => {
  // Generate the JWT token with a 7-day expiration
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { 
    expiresIn: "7d" 
  });
  
  // Set a persistent cookie that lasts 7 days
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
  });

  return token;
};

export default generateTokenAndSetCookies 


