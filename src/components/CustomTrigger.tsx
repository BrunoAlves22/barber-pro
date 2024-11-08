"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

interface CustomTriggerProps {
  className?: string;
}

export function CustomTrigger({ className }: CustomTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      onClick={toggleSidebar}
      className={cn(
        "flex items-center justify-center hover:bg-zinc-600 transition-colors duration-300 p-1 rounded cursor-pointer",
        className
      )}
    >
      <Menu size={22} className="text-white" />
    </div>
  );
}
