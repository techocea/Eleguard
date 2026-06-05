"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

//added types for the user here
export interface User {
  id: string;
  name: string;
  role: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokenValue: string, userData: User) => void;
  logout: () => void;
}

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
            : { id: "1", name: "Farm Manager", role: "USER" },
        );
      } catch {
        setUser({ id: "1", name: "Farm Manager", role: "USER" });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (tokenValue: string, userData: User) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
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
