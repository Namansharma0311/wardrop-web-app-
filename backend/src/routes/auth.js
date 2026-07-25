import express from "express";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../db.js";
import { signToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong creating your account" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });
    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong logging you in" });
  }
});

export default router;
