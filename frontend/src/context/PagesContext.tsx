"use client";

import { createContext, useContext, useCallback, useState } from "react";

interface PagesContextType {
  refreshPages: () => void;
  lastRefresh: number;
}

const PagesContext = createContext<PagesContextType>({
  refreshPages: () => {},
  lastRefresh: 0,
});

export function usePagesContext() {
  return useContext(PagesContext);
}

export function PagesProvider({ children }: { children: React.ReactNode }) {
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const refreshPages = useCallback(() => setLastRefresh(Date.now()), []);
  return (
    <PagesContext.Provider value={{ refreshPages, lastRefresh }}>
      {children}
    </PagesContext.Provider>
  );
}