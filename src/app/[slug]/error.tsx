"use client";

import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="font-display text-3xl text-text-primary">
        Une erreur est survenue
      </h1>
      <p className="mt-4 text-text-secondary">
        Impossible de charger cette page d&apos;audit.
      </p>
      <Button onClick={reset} className="mt-8">
        R&eacute;essayer
      </Button>
    </div>
  );
}
