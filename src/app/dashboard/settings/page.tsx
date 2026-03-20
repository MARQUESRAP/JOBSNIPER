"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTestWebhook = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "page_view",
          landing_page_id: "test",
          slug: "test-webhook",
          visitor_id: "test-" + Date.now(),
          device: "desktop",
          referrer: null,
          metadata: { test: true },
        }),
      });

      if (res.ok) {
        setTestResult("Webhook envoy\u00e9 avec succ\u00e8s.");
      } else {
        setTestResult("Erreur lors de l'envoi du webhook.");
      }
    } catch {
      setTestResult("Erreur r\u00e9seau.");
    }

    setTesting(false);
  };

  const configs = [
    {
      label: "Webhook n8n",
      value: process.env.NEXT_PUBLIC_APP_URL
        ? "Configur\u00e9"
        : "Non configur\u00e9",
    },
    {
      label: "URL Calendly",
      value:
        process.env.NEXT_PUBLIC_CALENDLY_URL || "Non configur\u00e9",
    },
    {
      label: "Email contact",
      value:
        process.env.NEXT_PUBLIC_CONTACT_EMAIL || "raphael@gralt.fr",
    },
    {
      label: "URL Application",
      value:
        process.env.NEXT_PUBLIC_APP_URL || "https://audit.gralt.fr",
    },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      {/* Configuration */}
      <div className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">
          Configuration
        </h3>
        <div className="space-y-4">
          {configs.map((config) => (
            <div
              key={config.label}
              className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0 last:pb-0"
            >
              <span className="text-sm text-text-secondary">{config.label}</span>
              <span className="font-mono text-sm text-text-primary">
                {config.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Test webhook */}
      <div className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">
          Test tracking
        </h3>
        <p className="mb-4 text-sm text-text-secondary">
          Envoie un &eacute;v&eacute;nement de test pour v&eacute;rifier que le webhook n8n fonctionne.
        </p>
        <Button onClick={handleTestWebhook} disabled={testing} size="sm">
          {testing ? "Envoi en cours..." : "Tester le webhook"}
        </Button>
        {testResult && (
          <p className="mt-3 text-sm text-text-accent">{testResult}</p>
        )}
      </div>
    </div>
  );
}
