import { Router } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { loginLimiter } from "../middleware/rateLimit.js";
dotenv.config()

const router = Router();

const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
const jwtSecret = process.env.JWT_SECRET;

if (!adminPasswordHash || !jwtSecret) {
  throw new Error("Missing ADMIN_PASSWORD_HASH or JWT_SECRET in environment variables.");
}

router.post('/login', loginLimiter, async (req, res) => {
  const { password } = req.body

  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  try {
    const isMatch = await bcrypt.compare(password, adminPasswordHash)
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect Password"})
    }

    const payload = { role: "admin" };
    const token = jwt.sign(payload, jwtSecret, {expiresIn: "2h"})
    
    return res.status(200).json({ success: true, message: "Login successful", token: token})
    } catch (error) {
        console.log("Error in login: ", error)
        res.status(500).json({success: false, message: "Internal Server Error" })
    }
});

export default router