import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import { uploadDirPath } from "./storage.js";
import authRoutes from "./routes/auth.js";
import clothesRoutes from "./routes/clothes.js";
import outfitsRoutes from "./routes/outfits.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDirPath));

app.use("/api/auth", authRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/outfits", outfitsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Unexpected server error" });
});

await initDb();
app.listen(PORT, () => {
  console.log(`Wardrobe API running on http://localhost:${PORT}`);
  console.log(`Using mock DB (lowdb JSON file) — see backend/src/db.js to swap in MongoDB Atlas`);
  console.log(`Using mock storage (local disk) — see backend/src/storage.js to swap in Cloudinary`);
});
