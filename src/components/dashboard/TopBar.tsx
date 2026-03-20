"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const pageTitles: Record<string, string> = {
  "/dashboard": "Pipeline",
  "/dashboard/prospects": "Prospects",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitles[pathname] || "Dashboard";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle px-6">
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs text-text-tertiary">Syst&egrave;me OK</span>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
        >
          <LogOut className="h-4 w-4" />
          D&eacute;connexion
        </button>
      </div>
    </header>
  );
}
