// import jwt from "jsonwebtoken";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     // 1. Verify cookie name consistency
//     const token = req.cookies.jwt; // Changed from 'token' to 'jwt'
    
//     if (!token) {
//       return res.status(401).json({ 
//         message: "Authentication required", 
//         success: false 
//       });
//     }

//     // 2. Validate JWT_SECRET presence
//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is not defined");
//       return res.status(500).json({
//         message: "Server configuration error",
//         success: false
//       });
//     }

//     // 3. Add token validation
//     if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)) {
//       return res.status(401).json({
//         message: "Invalid token format",
//         success: false
//       });
//     }

//     // 4. Improved verification with error handling
//     const decode = jwt.verify(token, process.env.JWT_SECRET, {
//       algorithms: ['HS256'], // Specify allowed algorithms
//       ignoreExpiration: false // Ensure expiration check
//     });

//     // 5. Validate decoded payload
//     if (!decode?.userId) {
//       return res.status(401).json({
//         message: "Invalid token payload",
//         success: false
//       });
//     }

//     req.userId = decode.userId;
//     next();

//   } catch (error) {
//     console.error("JWT Verification Error:", error.name);
    
//     // 6. Specific error handling
//     const errorResponse = {
//       success: false,
//       message: "Authentication failed"
//     };

//     if (error instanceof jwt.JsonWebTokenError) {
//       errorResponse.message = "Invalid token signature";
//       if (error instanceof jwt.TokenExpiredError) {
//         errorResponse.message = "Token expired";
//       }
//       return res.status(401).json(errorResponse);
//     }

//     res.status(500).json({
//       message: "Authentication system error",
//       success: false
//     });
//   }
// };

// export default isAuthenticated;



import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({ message: "Authentication error", success: false });
  }
};

export default isAuthenticated;
