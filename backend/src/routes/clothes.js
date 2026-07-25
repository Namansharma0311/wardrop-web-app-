import express from "express";
import {
  createClothing,
  listClothing,
  getClothingById,
  updateClothing,
  deleteClothing,
} from "../db.js";
import { upload, fileToUrl } from "../storage.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

// GET /api/clothes?search=&category=&season=&occasion=&favorite=
router.get("/", async (req, res) => {
  const items = await listClothing(req.userId);
  const { search, category, season, occasion, favorite } = req.query;

  let filtered = items;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q) ||
        i.color.toLowerCase().includes(q)
    );
  }
  if (category) filtered = filtered.filter((i) => i.category === category);
  if (season) filtered = filtered.filter((i) => i.season === season);
  if (occasion) filtered = filtered.filter((i) => i.occasion === occasion);
  if (favorite === "true") filtered = filtered.filter((i) => i.favorite);

  res.json(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file ? fileToUrl(req.file.filename) : null;
    const item = await createClothing(req.userId, { ...req.body, imageUrl });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Could not save this item" });
  }
});

router.patch("/:id", upload.single("image"), async (req, res) => {
  const updates = { ...req.body };
  if (req.body.favorite !== undefined) updates.favorite = req.body.favorite === "true" || req.body.favorite === true;
  if (req.file) updates.imageUrl = fileToUrl(req.file.filename);
  const item = await updateClothing(req.userId, req.params.id, updates);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

router.delete("/:id", async (req, res) => {
  const ok = await deleteClothing(req.userId, req.params.id);
  if (!ok) return res.status(404).json({ error: "Item not found" });
  res.json({ success: true });
});

export default router;
