"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange } from "@/lib/auth";
import type { User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logoutUser = async () => {
    const { logout: firebaseLogout } = await import("@/lib/auth");
    await firebaseLogout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
