"use client";
import { createContext, ReactNode } from "react";

interface AuthProviderProps {
  token: string | null;
  children: ReactNode;
}

export const AuthContext = createContext<string | null>(null);

export default function AuthProvider({ token, children }: AuthProviderProps) {
  return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
}
