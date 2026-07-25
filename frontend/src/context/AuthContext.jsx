import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setToken, getStoredToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    const email = localStorage.getItem("ck_email");
    if (token && email) setUser({ email });
    setReady(true);
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    if (!data || !data.token) throw new Error("Login failed — no token received");
    setToken(data.token);
    localStorage.setItem("ck_email", data.user.email);
    setUser(data.user);
  }

  async function register(email, password) {
    const data = await api.register(email, password);
    if (!data || !data.token) throw new Error("Registration failed — no token received");
    setToken(data.token);
    localStorage.setItem("ck_email", data.user.email);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("ck_email");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
