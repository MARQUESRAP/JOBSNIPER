import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="font-display text-4xl text-text-primary">
        Page introuvable
      </h1>
      <p className="mt-4 text-text-secondary">
        Cette page d&apos;audit n&apos;existe pas ou n&apos;est plus
        disponible.
      </p>
      <Link
        href="mailto:raphael@gralt.fr"
        className="mt-8 text-text-accent underline-offset-4 hover:underline"
      >
        Nous contacter
      </Link>
    </div>
  );
}
