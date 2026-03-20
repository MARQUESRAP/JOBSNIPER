"use client";

import { useEffect, useState } from "react";
import GraltLogo from "@/components/ui/GraltLogo";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-16 items-center px-6 transition-all duration-300",
        scrolled
          ? "border-b border-border-subtle bg-bg-primary/80 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <GraltLogo size="md" />
    </nav>
  );
}
