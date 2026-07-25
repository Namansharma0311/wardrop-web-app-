import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm hangtag p-6">
        <div className="stitch mb-6" />
        <h1 className="font-display font-800 text-3xl mb-1">Welcome back</h1>
        <p className="text-sm text-ink/50 mb-6">Sign in to your private closet.</p>
        {error && <p className="text-sm text-clay mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-ink/60 font-display font-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-line rounded-tag px-3 py-2 bg-canvas focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink/60 font-display font-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-line rounded-tag px-3 py-2 bg-canvas focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss hover:bg-mossdark text-white font-display font-700 uppercase tracking-wide py-2.5 rounded-tag disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-sm text-ink/50 mt-5 text-center">
          New here?{" "}
          <Link to="/register" className="text-moss font-600 underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
