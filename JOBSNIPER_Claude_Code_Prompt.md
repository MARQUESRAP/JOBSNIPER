# PROMPT CLAUDE CODE — Application audit.gralt.fr
## Projet JobSniper — Application Next.js de Landing Pages Personnalisées

---

## CONTEXTE DU PROJET

Tu vas construire une application Next.js complète pour le projet "JobSniper". Ce projet est un système de prospection automatisée B2B : on scrape des offres d'emploi commerciales en France, on les analyse avec Claude AI pour déterminer si les tâches sont automatisables par des agents IA, puis on génère une page d'audit personnalisée pour chaque prospect.

L'application que tu vas créer est hébergée sur **audit.gralt.fr** et a deux fonctions :
1. **Pages d'audit personnalisées** (publiques) : une page unique par prospect, accessible via `audit.gralt.fr/[slug]`, qui présente l'analyse de leur offre d'emploi et propose un agent IA comme alternative
2. **Dashboard de pilotage** (privé) : une interface pour gérer le pipeline de prospection, accessible via `audit.gralt.fr/dashboard`

Le contexte complet du projet, l'architecture des workflows, le catalogue d'agents IA et les prompts de production sont dans les fichiers `JOBSNIPER_Blueprint_V2.md` et `JOBSNIPER_Prompts_Production.md` fournis dans le dossier. **Lis-les intégralement avant de commencer à coder.**

---

## STACK TECHNIQUE

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript (strict mode)
- **Styling** : Tailwind CSS 4
- **Base de données** : Supabase (PostgreSQL + API REST + Realtime)
- **Auth dashboard** : Supabase Auth (magic link ou password simple — un seul user admin)
- **Booking** : Calendly embed (URL placeholder : `https://calendly.com/raph-gralt/15min`)
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Fonts** : Google Fonts (voir section design)
- **Hébergement** : Docker sur VPS Hostinger (Traefik reverse proxy) — pas de Vercel
- **Tracking** : Custom JS → webhook n8n (pas de Google Analytics)

---

## ARCHITECTURE DU PROJET

```
audit.gralt.fr/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Layout global (fonts, metadata)
│   │   ├── page.tsx                      # Page d'accueil (redirect vers gralt.fr ou 404)
│   │   ├── [slug]/
│   │   │   └── page.tsx                  # Page d'audit personnalisée (SSR)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                # Layout dashboard (auth guard)
│   │   │   ├── page.tsx                  # Vue pipeline principale
│   │   │   ├── prospects/
│   │   │   │   └── page.tsx              # Liste détaillée des prospects
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx              # Stats et métriques globales
│   │   │   └── settings/
│   │   │       └── page.tsx              # Paramètres (API keys, etc.)
│   │   └── api/
│   │       ├── track/
│   │       │   └── route.ts              # Endpoint tracking (reçoit events des pages)
│   │       └── webhook/
│   │           └── calendly/
│   │               └── route.ts          # Webhook Calendly booking
│   ├── components/
│   │   ├── audit-page/                   # Composants de la page d'audit
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AuditSection.tsx
│   │   │   ├── SolutionSection.tsx
│   │   │   ├── RoiSection.tsx
│   │   │   ├── CredibilitySection.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── AgentCard.tsx
│   │   │   ├── RoiComparison.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ScrollReveal.tsx          # Wrapper animation au scroll
│   │   ├── dashboard/                    # Composants du dashboard
│   │   │   ├── PipelineView.tsx
│   │   │   ├── ProspectTable.tsx
│   │   │   ├── ProspectRow.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   └── ui/                           # Composants UI réutilisables
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Tooltip.tsx
│   │       ├── GraltLogo.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Client Supabase (browser)
│   │   │   ├── server.ts                 # Client Supabase (server)
│   │   │   └── types.ts                  # Types générés depuis le schéma DB
│   │   ├── tracking.ts                   # Fonctions de tracking (events → API)
│   │   ├── utils.ts                      # Helpers (formatCurrency, slugify, etc.)
│   │   └── constants.ts                  # Constantes (couleurs, config)
│   ├── hooks/
│   │   ├── useScrollReveal.ts            # Hook intersection observer
│   │   ├── useTracker.ts                 # Hook tracking page
│   │   └── useTimeOnPage.ts              # Hook temps passé sur la page
│   └── styles/
│       └── globals.css                   # Styles globaux + Tailwind config
├── public/
│   ├── fonts/                            # Fonts locales si nécessaire
│   └── images/
│       └── gralt-logo.svg                # Logo Gralt
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Migration initiale (toutes les tables)
├── Dockerfile                            # Docker config pour production
├── docker-compose.yml                    # Docker compose
├── .env.example                          # Variables d'environnement template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## BASE DE DONNÉES SUPABASE — Schéma SQL complet

Crée un fichier de migration SQL (`supabase/migrations/001_initial_schema.sql`) avec toutes les tables. Le schéma complet est décrit dans le Blueprint V2, mais voici les points critiques :

### Tables principales
- `companies` — données enrichies des entreprises
- `job_offers` — offres d'emploi scrapées avec leur analyse
- `agents_catalog` — catalogue des 5 agents IA Gralt
- `landing_pages` — contenu JSON des pages générées + slug
- `email_campaigns` — emails envoyés + statuts + séquence
- `page_analytics` — événements de tracking des visites

### Points critiques SQL
- La colonne `landing_pages.url` doit être un champ GENERATED basé sur le slug : `TEXT GENERATED ALWAYS AS ('https://audit.gralt.fr/' || slug) STORED`
- Activer RLS (Row Level Security) sur toutes les tables
- Policy : les pages d'audit (`landing_pages`) sont lisibles par tous (publique), tout le reste est protégé (admin only)
- Créer un index sur `landing_pages.slug` (lookup fréquent)
- Créer un index sur `job_offers.status` (filtre fréquent)
- Créer un index sur `page_analytics.landing_page_id` + `created_at` (requêtes analytics)
- Les types enum pour les statuts doivent être des CHECK constraints, pas des types PostgreSQL custom (plus simple à maintenir)

### Seed data — Catalogue d'agents
Insère les 5 agents du catalogue directement dans la migration ou dans un fichier seed séparé. Les détails complets de chaque agent sont dans le Blueprint V2, section 2.

---

## DESIGN — PAGE D'AUDIT PERSONNALISÉE

### Direction esthétique : "Dark Luxury Minimal"
La page doit ressembler à un document premium, comme un rapport de consulting haut de gamme en version digitale. L'objectif est que le prospect pense "ils ont vraiment fait un travail sérieux pour nous".

### Palette de couleurs (CSS variables obligatoires)

```css
:root {
  /* Backgrounds */
  --bg-primary: #07070A;        /* Noir profond — fond principal */
  --bg-secondary: #0E0E14;     /* Noir légèrement plus clair — cards */
  --bg-tertiary: #16161F;      /* Fond des éléments interactifs */
  --bg-elevated: #1C1C28;      /* Fond hover / éléments en relief */

  /* Borders */
  --border-subtle: #1E1E2E;    /* Bordures très discrètes */
  --border-default: #2A2A3C;   /* Bordures standards */
  --border-accent: #3B82F6;    /* Bordures accent (bleu) */

  /* Texte */
  --text-primary: #F5F5F7;     /* Blanc cassé — titres et texte principal */
  --text-secondary: #A1A1AA;   /* Gris — texte secondaire */
  --text-tertiary: #71717A;    /* Gris plus foncé — labels, metadata */
  --text-accent: #60A5FA;      /* Bleu clair — liens, éléments interactifs */

  /* Accent */
  --accent-primary: #3B82F6;   /* Bleu électrique — CTA, éléments clés */
  --accent-primary-hover: #2563EB;
  --accent-primary-glow: rgba(59, 130, 246, 0.15); /* Glow effect subtil */

  /* Sémantique */
  --success: #22C55E;          /* Vert — tâches automatisables */
  --success-bg: rgba(34, 197, 94, 0.1);
  --danger: #EF4444;           /* Rouge — tâches non automatisables */
  --danger-bg: rgba(239, 68, 68, 0.1);
  --warning: #F59E0B;          /* Orange — tâches partielles */
  --warning-bg: rgba(245, 158, 11, 0.1);

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #07070A 0%, #0C1222 50%, #07070A 100%);
  --gradient-card: linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, transparent 100%);
  --gradient-accent: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
}
```

### Typographie

- **Font display (titres)** : "Instrument Serif" de Google Fonts — élégante, distinctive, premium. Fallback : Georgia, serif.
- **Font body (texte)** : "Geist" ou "Geist Sans" — moderne, lisible, technique. Si indisponible via Google Fonts, utiliser "DM Sans" comme alternative. Fallback : system-ui, sans-serif.
- **Font mono (chiffres, stats)** : "Geist Mono" ou "JetBrains Mono" — pour les données chiffrées, pourcentages, prix.

Hiérarchie :
- H1 (Hero) : Instrument Serif, 48-56px desktop / 32-36px mobile, font-weight 400, tracking tight
- H2 (Section titles) : Instrument Serif, 32-40px desktop / 24-28px mobile, font-weight 400
- H3 (Sous-titres) : DM Sans, 20-24px, font-weight 600
- Body : DM Sans, 16-18px, font-weight 400, line-height 1.7
- Small/Labels : DM Sans, 13-14px, font-weight 500, uppercase tracking wide, color text-tertiary
- Stats/Numbers : JetBrains Mono, variable size, font-weight 700

### Animations (Framer Motion)

Toutes les sections utilisent un composant `ScrollReveal` basé sur Framer Motion :

```tsx
// Comportement souhaité
- Chaque section apparaît au scroll avec un fade-in + slide-up de 30px
- Stagger de 0.1s entre les éléments enfants
- Duration : 0.6s, ease: [0.25, 0.46, 0.45, 0.94]
- Threshold intersection observer : 0.15
- Animation once: true (ne se rejoue pas)
```

Animations spécifiques :
- **Barre de progression** (ratio automatisation) : animation de remplissage de gauche à droite, durée 1.2s, ease out, trigger au scroll
- **Scores des tâches** : compteur animé de 0 au score final, durée 0.8s
- **Comparaison ROI** : les deux barres se remplissent en parallèle avec un léger décalage (0.2s)
- **CTA button** : subtle glow pulsation (box-shadow animé), pas agressif
- **Cards** : légère élévation au hover (translateY -2px + shadow plus prononcée)

### Structure détaillée de chaque section de la page

#### NAVBAR (fixe en haut)
- Hauteur : 64px
- Background : bg-primary avec backdrop-blur quand scrolled
- Gauche : Logo Gralt (SVG, petit, ~24px de haut) + texte "gralt" en font display
- Droite : rien (pas de navigation, la page est un one-pager)
- Border bottom subtle quand scrolled
- Transition smooth au scroll

#### SECTION HERO
- Full viewport height (100vh) ou min-height 80vh
- Background : gradient-hero avec un subtle noise texture en overlay (opacity 0.03)
- Optionnel : un cercle de lumière bleu très diffus en arrière-plan (pseudo-element, radial-gradient bleu à 3-5% opacity)
- Contenu centré verticalement :
  - Label en haut : "AUDIT PERSONNALISÉ" en small/label style (uppercase, tracking wide, text-tertiary, avec un petit trait horizontal avant)
  - Titre H1 : "[Nom Entreprise], on a analysé votre offre de [Poste]." — Instrument Serif
  - Sous-titre : "[X] des [Y] tâches de ce poste sont automatisables par un agent IA." — DM Sans, text-secondary, 20px
  - Un chevron animé en bas invitant à scroller (bounce subtil)

#### SECTION AUDIT
- Background : bg-primary
- Padding : 80-120px vertical
- Titre de section H2 : "Audit de votre offre"
- Texte d'intro : 1-2 phrases contextuelles (text-secondary)
- **Grid de TaskCards** : une card par tâche identifiée
  - Layout : grille 1 colonne sur mobile, 2 colonnes sur desktop
  - Chaque TaskCard contient :
    - Badge en haut à gauche : "AUTOMATISABLE" (vert, success-bg + success border) ou "HUMAIN REQUIS" (rouge, danger-bg + danger border) ou "PARTIEL" (orange)
    - Nom de la tâche en H3
    - Score visuel : barre horizontale colorée (vert/rouge/orange) avec le chiffre à droite (font mono)
    - Explication en body text (text-secondary)
    - Si automatisable : petit tag discret avec le nom de l'agent ("→ Agent Prospecteur Outbound")
  - Cards avec bg-secondary, border-subtle, rounded-xl, padding 24px
  - Hover : légère élévation + border-accent
- **Barre de synthèse** en bas de la section :
  - Barre de progression pleine largeur
  - Texte : "X tâches sur Y automatisables — Z%" avec le pourcentage en gros (font mono, accent color)
  - La barre se remplit au scroll avec la couleur accent

#### SECTION SOLUTION
- Background : bg-secondary (pour créer un contraste avec les sections précédente/suivante)
- Titre H2 : "La solution qu'on propose"
- Texte d'intro
- **AgentCard** principal :
  - Grande card (full width) avec bg-tertiary
  - En-tête : nom de l'agent + badge "Agent principal"
  - Description de l'agent (2-3 phrases)
  - Liste des capacités clés (4 items) avec des icônes Lucide pertinentes (pas de bullet points classiques)
  - Ligne info : "Opérationnel en [X] semaines" + "S'intègre dans [CRM mentionné]"
  - Border gauche accent (3px solid accent-primary)
- **AgentCard** secondaire (si applicable) :
  - Card plus petite, même style mais plus discret
  - Badge "Agent complémentaire"
  - Description courte + valeur ajoutée

#### SECTION ROI
- Background : bg-primary
- Titre H2 : "Le calcul est simple"
- **Composant RoiComparison** :
  - Deux colonnes côte à côte (stack sur mobile)
  - Colonne gauche "Recrutement classique" :
    - Fond légèrement rouge (danger-bg)
    - Montant annuel en gros (font mono, 40px+)
    - Détails en dessous (salaire + charges + onboarding + turnover)
  - Colonne droite "Agent IA Gralt" :
    - Fond légèrement vert (success-bg)
    - Montant mensuel ET annuel (font mono)
    - Détails (opérationnel en X jours, 0 charge, scalable)
  - Au milieu ou en dessous : le chiffre d'économie en TRÈS gros, couleur accent
    - "Économie : XX XXX€/an" ou "soit XX% d'économie"
    - Ce chiffre doit être le focal point visuel de la section
- **Trois arguments bonus** en dessous :
  - 3 cards mini en row (icône + texte court)
  - Ex : ⚡ "Opérationnel en 2 semaines" / 🔄 "Disponible 24/7, 365j/an" / 📈 "Scalable sans surcoût"
  - (Utiliser des icônes Lucide, pas des emojis)
- **Ligne de prix** :
  - "À partir de 600€/mois, selon la complexité de votre environnement."
  - Style discret, text-secondary, centrée

#### SECTION CRÉDIBILITÉ
- Background : bg-secondary
- Titre H2 : le titre généré par Claude (ex: "On ne parle pas en théorie")
- **Case study** :
  - Card avec une bordure accent à gauche
  - Le texte du cas client
  - Le chiffre clé mis en avant (font mono, gros, accent color)
- **Points de crédibilité** :
  - 4 items en grille 2x2
  - Chaque item : icône Lucide + texte court
  - Style minimal, text-secondary

#### SECTION CTA
- Background : bg-primary avec un gradient subtil vers le bleu (très discret)
- Padding vertical généreux (120px+)
- Titre H2 centré : le titre CTA généré par Claude
- Sous-titre centré : texte rassurant (text-secondary)
- **Embed Calendly** :
  - Utiliser l'embed inline Calendly (pas le popup)
  - Widget centré, max-width 700px
  - Intégrer via le script Calendly : `https://assets.calendly.com/assets/external/widget.js`
  - URL du calendrier : variable d'environnement `NEXT_PUBLIC_CALENDLY_URL`
  - Style : adapter le thème Calendly en dark si possible (paramètre `hide_gdpr_banner=1&background_color=0E0E14&text_color=F5F5F7&primary_color=3B82F6`)
- **Fallback email** en dessous du Calendly :
  - "Vous préférez échanger par email ?" + lien mailto:raph@gralt.fr
  - Style discret, text-tertiary

#### FOOTER
- Background : bg-primary
- Border top subtle
- Contenu minimal centré :
  - "Gralt — Automatisation IA pour PME"
  - "Lille, France"
  - Lien discret vers gralt.fr
- Hauteur compacte (padding 40px vertical)

---

## SYSTÈME DE TRACKING

Le tracking est un élément critique du système. Chaque page d'audit envoie des événements à un endpoint API interne, qui les stocke dans Supabase ET les forward vers un webhook n8n pour les alertes temps réel.

### Événements à tracker

```typescript
type TrackEvent = {
  event_type: 'page_view' | 'scroll_25' | 'scroll_50' | 'scroll_75' | 'scroll_100' | 'section_view' | 'cta_click' | 'calendly_click' | 'time_update' | 'calendly_booking';
  landing_page_id: string;
  slug: string;
  visitor_id: string;      // UUID généré côté client, stocké en sessionStorage
  device: 'mobile' | 'tablet' | 'desktop';
  referrer: string | null;
  metadata?: Record<string, any>;  // données additionnelles selon l'event
};
```

### Hook useTracker

Crée un hook `useTracker(landingPageId, slug)` qui :
1. Génère un `visitor_id` unique par session (UUID v4, stocké dans une variable — pas localStorage)
2. Envoie un event `page_view` au montage du composant
3. Track le scroll depth (25%, 50%, 75%, 100%) via intersection observer sur des div sentinelles
4. Track le temps passé sur la page (envoie un `time_update` toutes les 30 secondes)
5. Track les clics sur le CTA et le widget Calendly
6. Détecte le device type via `navigator.userAgent` (simpliste suffit)

### API Route `/api/track`

```typescript
// POST /api/track
// Body : TrackEvent
// Actions :
// 1. Insérer dans Supabase → page_analytics
// 2. Si event_type est 'page_view' ou 'cta_click' ou 'calendly_click' → forward vers webhook n8n
// 3. Le webhook n8n URL est dans la variable d'env TRACKING_WEBHOOK_URL
// 4. Répondre 200 OK immédiatement (fire and forget pour le webhook)
```

### API Route `/api/webhook/calendly`

```typescript
// POST /api/webhook/calendly
// Reçoit les webhooks Calendly quand un booking est confirmé
// Actions :
// 1. Extraire les infos du booking (nom, email, date, heure)
// 2. Insérer un event 'calendly_booking' dans page_analytics
// 3. Mettre à jour le statut de l'email_campaign correspondant → 'booked'
// 4. Forward vers webhook n8n pour alerte Telegram
```

---

## DASHBOARD — audit.gralt.fr/dashboard

### Auth
- Authentification Supabase simple (email + password)
- Un seul compte admin (raph@gralt.fr)
- Guard sur le layout du dashboard : si pas authentifié → redirect vers page de login
- Page de login : minimaliste, dark theme, email + password + bouton

### Design du dashboard
- Même dark theme que les pages d'audit (cohérence)
- Layout : sidebar gauche (240px) + contenu principal
- Sidebar : logo Gralt + liens navigation (Pipeline, Prospects, Analytics, Settings)
- TopBar : titre de la page courante + petit indicateur de statut système

### Page Pipeline (page principale)
- **Vue Kanban horizontal** des prospects par statut :
  - Colonnes : new → qualified → enriched → matched → page_ready → sent → opened → visited → booked → converted
  - Chaque card prospect : nom entreprise, poste, score, date
  - Drag and drop PAS nécessaire (trop complexe, les statuts changent automatiquement)
  - Juste une visualisation du flux
- **Compteurs en haut** (StatsCards) :
  - Total offres scrapées (cette semaine)
  - Offres qualifiées
  - Pages générées
  - Emails envoyés
  - Taux d'ouverture
  - Pages visitées
  - Calls bookés
- Design : cards avec bg-secondary, chiffre en gros (font mono), label en small

### Page Prospects
- **Tableau** de tous les prospects avec colonnes :
  - Entreprise | Poste | Score | Statut | Dernière action | Date | Actions
- Filtrable par statut
- Triable par score, date
- Clic sur une ligne → expansion avec détails (analyse, matching, lien vers la page, lien vers le mail)
- Bouton "Voir la page" qui ouvre la landing page dans un nouvel onglet
- Bouton "Relancer" pour déclencher manuellement un follow-up

### Page Analytics
- **Métriques globales** :
  - Taux d'ouverture des mails (ouvertures / envois)
  - Taux de clic (clics lien / ouvertures)
  - Taux de visite page (visites / clics)
  - Taux de booking (bookings / visites)
  - Temps moyen sur les pages
  - Score moyen des offres qualifiées
- **Graphique** : évolution des envois / ouvertures / visites / bookings par semaine (recharts, LineChart)
- **Activité récente** (ActivityFeed) :
  - Liste chronologique des derniers événements : "[Entreprise] a ouvert le mail", "[Entreprise] a visité la page (2min34)", "[Entreprise] a booké un call"
  - Chaque event avec un point de couleur (🟡 ouverture, 🟠 visite, 🔴 clic CTA, 🟢 booking)
  - Rafraîchissement auto via Supabase Realtime

### Page Settings
- Configuration des variables :
  - URL du webhook n8n (pour le tracking)
  - URL Calendly
  - Email de signature
- Affichage des stats API :
  - Nombre d'appels Claude ce mois
  - Nombre de recherches SerpAPI ce mois
- Bouton "Test tracking" pour vérifier que le webhook n8n fonctionne

---

## VARIABLES D'ENVIRONNEMENT

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/raph-gralt/15min

# Tracking
TRACKING_WEBHOOK_URL=https://n8n.gralt.fr/webhook/jobsniper-track

# App
NEXT_PUBLIC_APP_URL=https://audit.gralt.fr
NEXT_PUBLIC_MAIN_SITE_URL=https://gralt.fr

# Contact
NEXT_PUBLIC_CONTACT_EMAIL=raph@gralt.fr
```

---

## DOCKER — Configuration de production

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  audit-app:
    build: .
    restart: always
    ports:
      - "3050:3000"
    env_file:
      - .env
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.audit.rule=Host(`audit.gralt.fr`)"
      - "traefik.http.routers.audit.entrypoints=websecure"
      - "traefik.http.routers.audit.tls.certresolver=letsencrypt"
      - "traefik.http.services.audit.loadbalancer.server.port=3000"
    networks:
      - traefik-net

networks:
  traefik-net:
    external: true
```

### next.config.ts — Ajouter :
```typescript
output: 'standalone'  // Nécessaire pour le Docker build optimisé
```

---

## RÈGLES DE CODE

### TypeScript
- Strict mode activé
- Pas de `any` — typer correctement chaque variable, prop, retour de fonction
- Interfaces pour les données Supabase (miroir du schéma SQL)
- Types séparés dans `lib/supabase/types.ts`

### Composants React
- Functional components uniquement
- Props typées avec interfaces
- Pas de prop drilling au-delà de 2 niveaux → utiliser le contexte ou passer les données via server components
- Server components par défaut, "use client" uniquement quand nécessaire (animations, interactivité, hooks)

### Data fetching
- Page d'audit `[slug]/page.tsx` : Server Component avec fetch Supabase côté serveur
  - `generateMetadata` pour les meta tags dynamiques
  - Fetch le contenu de la page depuis `landing_pages` WHERE slug = params.slug AND is_active = true
  - 404 si pas de page trouvée
  - Passer les données aux composants client via props
- Dashboard : Server Components pour le data fetching initial, Client Components pour l'interactivité (filtres, tri, realtime)

### Performance
- Images : pas d'images lourdes, tout est en CSS/SVG
- Fonts : preload des Google Fonts via `next/font/google`
- Lazy loading des sections below-the-fold (pas critique car scroll-based animations le gèrent naturellement)
- Le script Calendly doit être chargé en `async` uniquement quand la section CTA est visible

### Responsive
- Mobile-first
- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- La page d'audit doit être parfaite sur mobile (c'est là que la plupart des décideurs liront)
- Le dashboard peut être desktop-only (Raph l'utilise sur son ordi)

---

## ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

1. **Setup projet** : Init Next.js + TypeScript + Tailwind + Framer Motion + structure des dossiers
2. **Migration Supabase** : Écrire le SQL complet, créer les tables, seed les agents
3. **Lib Supabase** : Client, server, types
4. **Composants UI de base** : Button, Card, Badge, Logo, ScrollReveal
5. **Page d'audit** : Construire section par section (Hero → Audit → Solution → ROI → Crédibilité → CTA → Footer)
6. **Tracking** : Hook useTracker + API route /api/track
7. **Page [slug]** : Server component qui fetch Supabase et rend la page d'audit
8. **Dashboard layout** : Sidebar + TopBar + Auth guard
9. **Dashboard pages** : Pipeline → Prospects → Analytics → Settings
10. **Webhook Calendly** : API route
11. **Docker** : Dockerfile + docker-compose + test build
12. **Polish** : Animations, responsive, edge cases, 404, loading states

---

## DONNÉES DE TEST

Pour pouvoir développer et tester sans attendre les workflows n8n, crée un fichier de seed avec au moins 3 landing pages de test complètes. Voici un exemple de données à générer :

**Page test 1** : "TechSolutions SAS" qui recrute un "SDR - Business Developer Junior" → score 8/10, 5/7 tâches automatisables, agent principal : Prospecteur Outbound
**Page test 2** : "LogiPro France" qui recrute un "Assistant ADV" → score 9/10, 6/7 tâches automatisables, agent principal : Gestionnaire ADV
**Page test 3** : "ConseilPlus" qui recrute un "Chargé de clientèle" → score 6/10, 3/6 tâches automatisables → exemple de cas limite

Génère des données réalistes et complètes pour ces 3 cas (remplis le JSON complet du `page_content` pour chaque landing page, avec toutes les sections).

---

## CE QUE TU NE DOIS PAS FAIRE

- Ne PAS utiliser de CMS headless ou de système de templates externe — tout est en React/Next.js
- Ne PAS utiliser de composants UI libraries lourdes (pas de Material UI, pas de Ant Design) — Tailwind + composants custom
- Ne PAS utiliser localStorage pour le tracking (utiliser des variables en mémoire / sessionStorage uniquement pour le visitor_id)
- Ne PAS créer de système d'auth complexe — un seul user admin, Supabase Auth basique suffit
- Ne PAS over-engineer le dashboard — c'est un outil interne pour une seule personne, pas un produit SaaS
- Ne PAS utiliser de purple gradients, d'Inter font, ou de design "generic AI tool" — le design doit être premium et distinctif
- Ne PAS utiliser d'emojis dans l'interface (ni page d'audit, ni dashboard) — icônes Lucide uniquement
- Ne PAS hardcoder les données de page — tout vient de Supabase via le slug
- Ne PAS oublier le responsive sur la page d'audit — c'est critique, les décideurs lisent sur mobile

---

## RÉSUMÉ

Tu construis audit.gralt.fr, une application Next.js 15 qui :
1. Sert des pages d'audit personnalisées en dark theme premium, alimentées par Supabase
2. Tracke les interactions (visites, scroll, clics, temps) et les envoie à n8n via webhook
3. Offre un dashboard de pilotage pour suivre le pipeline de prospection
4. Tourne en Docker sur un VPS Hostinger derrière Traefik
5. Est pensée pour impressionner des décideurs de PME françaises et les convertir en clients

Les fichiers JOBSNIPER_Blueprint_V2.md et JOBSNIPER_Prompts_Production.md dans le dossier contiennent tout le contexte métier, l'architecture des workflows, le catalogue d'agents, et les prompts de production. Réfère-toi à eux pour toute question sur les données, les agents ou le fonctionnement du système.

Commence par lire ces deux fichiers, puis attaque le développement dans l'ordre recommandé.
