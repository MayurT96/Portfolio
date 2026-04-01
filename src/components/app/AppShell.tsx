"use client";

import { PropsWithChildren } from "react";
import CustomCursor from "@/components/cursor/CustomCursor";
import LoadingScreen from "@/components/overlays/LoadingScreen";
import ScrollProgressIndicator from "@/components/overlays/ScrollProgressIndicator";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressIndicator />
      <LoadingScreen />
      {children}
    </div>
  );
}
