"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import type { User } from "@/types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: () => {}, refresh: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/login", "/register"];

  async function loadUser() {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.auth.me();
      setUser(data.user);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && !publicPaths.includes(pathname)) {
      router.replace("/login");
    }
    if (user && publicPaths.includes(pathname)) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  function logout() {
    removeToken();
    setUser(null);
    router.replace("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
