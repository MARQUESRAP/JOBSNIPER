export default function Footer() {
  return (
    <footer className="border-t border-border-subtle px-6 py-10">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-display text-sm font-medium text-text-secondary">
          Gralt &mdash; Automatisation IA pour PME
        </p>
        <p className="mt-1 text-sm text-text-tertiary">Lille, France</p>
        <a
          href="mailto:raphael@gralt.fr"
          className="mt-2 inline-block text-xs text-text-tertiary underline-offset-4 transition-colors hover:text-text-accent hover:underline"
        >
          raphael@gralt.fr
        </a>
      </div>
    </footer>
  );
}
