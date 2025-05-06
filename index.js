import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import authRouter from "./route/authRoute.js"

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1',authRouter)

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Express.js Server!');
});

// Database connection and server start
const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();