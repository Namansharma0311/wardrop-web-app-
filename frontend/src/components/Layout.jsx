import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItem = ({ isActive }) =>
  `px-3 py-2 text-sm uppercase tracking-wide font-display font-semibold transition-colors ${
    isActive ? "text-moss" : "text-ink/60 hover:text-ink"
  }`;

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line bg-canvas sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-4 h-4 rounded-full border-2 border-ink/70 inline-block" />
            <span className="font-display font-800 text-xl tracking-tight">
              CLOSET<span className="text-moss">KEEPER</span>
            </span>
          </Link>
          {user && (
            <nav className="flex items-center gap-1">
              <NavLink to="/" className={navItem} end>
                Wardrobe
              </NavLink>
              <NavLink to="/outfits" className={navItem}>
                Outfits
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-3 py-2 text-sm uppercase tracking-wide font-display font-semibold text-ink/60 hover:text-clay"
              >
                Sign out
              </button>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">{children}</main>
      <footer className="border-t border-line py-6 text-center text-xs text-ink/40 font-body">
        Private wardrobe — only you can see your closet.
      </footer>
    </div>
  );
}
