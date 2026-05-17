"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={cn("p-2 rounded-full glass hover:bg-white/40 dark:hover:bg-slate-800/80 transition-colors w-10 h-10 flex items-center justify-center", className)}>
        <span className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "p-2 rounded-full glass hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 w-10 h-10 flex items-center justify-center relative overflow-hidden",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-all absolute dark:-rotate-90 dark:opacity-0" />
      <Moon className="h-5 w-5 transition-all absolute rotate-90 opacity-0 dark:rotate-0 dark:opacity-100" />
    </button>
  );
}
