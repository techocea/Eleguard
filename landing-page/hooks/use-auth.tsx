"use client";

import { User, UserRole } from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    tokenValue: string,
    userData: Omit<User, "role"> & { role?: UserRole },
  ) => void;
  logout: () => void;
}

const deocdeRoleFromToken = (token: string): UserRole => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const raw = payload.role || payload.user_role || payload.authorities?.[0];
    return raw === "ADMIN" ? "ADMIN" : "USER";
  } catch (error) {
    return "USER";
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | "">("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
      try {
        setUser(
          storedUser
            ? JSON.parse(storedUser)
            : { token:storedToken, name: "Farm Manager", role: "USER" },
        );
      } catch {
        setUser( { token:storedToken, name: "Farm Manager", role: "USER" });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (
    tokenValue: string,
    userData: Omit<User, "role"> & { role?: UserRole },
  ) => {
    const authenticatedUser: User = {
      ...userData,
      role: userData.role ?? "USER",
    };

    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    setToken(tokenValue);
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be wrapped explicitly inside an <AuthProvider>",
    );
  }

  return context;
};
