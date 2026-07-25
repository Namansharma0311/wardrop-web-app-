import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";
import { CATEGORIES, SEASONS, OCCASIONS } from "../constants.js";
import ClothingCard from "../components/ClothingCard.jsx";
import AddClothingModal from "../components/AddClothingModal.jsx";

export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({ search: "", category: "", season: "", occasion: "", favorite: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listClothes(filters);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 200); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  async function toggleFavorite(item) {
    const formData = new FormData();
    formData.append("favorite", String(!item.favorite));
    const updated = await api.updateClothing(item.id, formData);
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function handleDelete(item) {
    if (!confirm(`Remove "${item.name || "this item"}" from your closet?`)) return;
    await api.deleteClothing(item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-800 text-4xl">Your wardrobe</h1>
          <p className="text-ink/50 text-sm mt-1">{items.length} item{items.length === 1 ? "" : "s"} catalogued</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-moss hover:bg-mossdark text-white font-display font-700 uppercase tracking-wide px-5 py-2.5 rounded-tag"
        >
          + Add piece
        </button>
      </div>

      <div className="hangtag p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search name, brand, color…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border border-line rounded-tag px-3 py-2 bg-canvas focus:bg-white text-sm flex-1 min-w-[180px]"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border border-line rounded-tag px-3 py-2 bg-canvas text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filters.season}
          onChange={(e) => setFilters({ ...filters, season: e.target.value })}
          className="border border-line rounded-tag px-3 py-2 bg-canvas text-sm"
        >
          <option value="">Any season</option>
          {SEASONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filters.occasion}
          onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
          className="border border-line rounded-tag px-3 py-2 bg-canvas text-sm"
        >
          <option value="">Any occasion</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.favorite === "true"}
            onChange={(e) => setFilters({ ...filters, favorite: e.target.checked ? "true" : "" })}
          />
          Favorites only
        </label>
      </div>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading your closet…</p>
      ) : items.length === 0 ? (
        <div className="hangtag p-10 text-center">
          <p className="font-display text-xl mb-1">Nothing here yet</p>
          <p className="text-ink/50 text-sm">Add your first piece to start your digital closet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <ClothingCard key={item.id} item={item} onToggleFavorite={toggleFavorite} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showAdd && (
        <AddClothingModal
          onClose={() => setShowAdd(false)}
          onCreated={(item) => {
            setItems((prev) => [item, ...prev]);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}
