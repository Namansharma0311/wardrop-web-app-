// db.js — Mock "MongoDB Atlas" using a local JSON file via lowdb.
// To swap in real MongoDB Atlas later:
//   1. npm install mongodb
//   2. Replace the functions below with MongoClient calls using process.env.MONGODB_URI
//   3. Keep the exported function signatures identical so routes/* don't change.

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const file = path.join(dataDir, "db.json");

const defaultData = { users: [], clothes: [], outfits: [] };
const adapter = new JSONFile(file);
const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  db.data ||= defaultData;
  await db.write();
}

// ---------- Users ----------
export async function createUser({ email, passwordHash }) {
  await db.read();
  const user = { id: uuid(), email, passwordHash, createdAt: new Date().toISOString() };
  db.data.users.push(user);
  await db.write();
  return user;
}

export async function findUserByEmail(email) {
  await db.read();
  return db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id) {
  await db.read();
  return db.data.users.find((u) => u.id === id);
}

// ---------- Clothes ----------
export async function createClothing(userId, fields) {
  await db.read();
  const item = {
    id: uuid(),
    userId,
    name: fields.name || "",
    category: fields.category || "",
    color: fields.color || "",
    brand: fields.brand || "",
    season: fields.season || "",
    occasion: fields.occasion || "",
    favorite: !!fields.favorite,
    imageUrl: fields.imageUrl || null,
    createdAt: new Date().toISOString(),
  };
  db.data.clothes.push(item);
  await db.write();
  return item;
}

export async function listClothing(userId) {
  await db.read();
  return db.data.clothes.filter((c) => c.userId === userId);
}

export async function getClothingById(userId, id) {
  await db.read();
  return db.data.clothes.find((c) => c.userId === userId && c.id === id);
}

export async function updateClothing(userId, id, updates) {
  await db.read();
  const item = db.data.clothes.find((c) => c.userId === userId && c.id === id);
  if (!item) return null;
  Object.assign(item, updates);
  await db.write();
  return item;
}

export async function deleteClothing(userId, id) {
  await db.read();
  const before = db.data.clothes.length;
  db.data.clothes = db.data.clothes.filter((c) => !(c.userId === userId && c.id === id));
  await db.write();
  return db.data.clothes.length < before;
}

// ---------- Outfits ----------
export async function createOutfit(userId, { name, itemIds }) {
  await db.read();
  const outfit = {
    id: uuid(),
    userId,
    name: name || "Untitled outfit",
    itemIds: itemIds || [],
    createdAt: new Date().toISOString(),
  };
  db.data.outfits.push(outfit);
  await db.write();
  return outfit;
}

export async function listOutfits(userId) {
  await db.read();
  return db.data.outfits.filter((o) => o.userId === userId);
}

export async function deleteOutfit(userId, id) {
  await db.read();
  const before = db.data.outfits.length;
  db.data.outfits = db.data.outfits.filter((o) => !(o.userId === userId && o.id === id));
  await db.write();
  return db.data.outfits.length < before;
}

export default db;
