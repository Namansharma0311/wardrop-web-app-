import { API_BASE } from "../config.js";

const BASE = API_BASE;

function getToken() {
  return localStorage.getItem("ck_token");
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isForm && body) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error(`Network error: ${err.message || "Could not reach server"}`);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong");
  }
  return data;
}

export const api = {
  register: (email, password) => request("/auth/register", { method: "POST", body: { email, password } }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),

  listClothes: (params = {}) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v)));
    return request(`/clothes${qs.toString() ? `?${qs}` : ""}`);
  },
  createClothing: (formData) => request("/clothes", { method: "POST", body: formData, isForm: true }),
  updateClothing: (id, formData) => request(`/clothes/${id}`, { method: "PATCH", body: formData, isForm: true }),
  deleteClothing: (id) => request(`/clothes/${id}`, { method: "DELETE" }),

  listOutfits: () => request("/outfits"),
  createOutfit: (name, itemIds) => request("/outfits", { method: "POST", body: { name, itemIds } }),
  deleteOutfit: (id) => request(`/outfits/${id}`, { method: "DELETE" }),
};

export function setToken(token) {
  if (token) localStorage.setItem("ck_token", token);
  else localStorage.removeItem("ck_token");
}

export function getStoredToken() {
  return getToken();
}
