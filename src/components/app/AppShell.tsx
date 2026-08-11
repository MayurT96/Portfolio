"use client";

import { PropsWithChildren, useEffect } from "react";
import CustomCursor from "@/components/cursor/CustomCursor";
import LoadingScreen from "@/components/overlays/LoadingScreen";
import ScrollProgressIndicator from "@/components/overlays/ScrollProgressIndicator";

export default function AppShell({ children }: PropsWithChildren) {
  useEffect(() => {
    const sessionKey = "portfolio_visit_tracked";
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "true");

      fetch("/api/track-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrer: document.referrer || "Direct",
          screenResolution: `${window.screen.width}x${window.screen.height}`,
        }),
      }).catch((err) => console.error("Error tracking visit:", err));
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressIndicator />
      <LoadingScreen />
      {children}
    </div>
  );
}
