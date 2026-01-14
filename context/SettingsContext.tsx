"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToBusinessSettings, type BusinessSettings } from "@/lib/db";

interface SettingsContextType {
  settings: BusinessSettings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToBusinessSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
