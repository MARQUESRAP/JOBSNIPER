# PROJET "JOBSNIPER" — Blueprint V2
## Système de Prospection Automatisée via Offres d'Emploi
## Stratégie : Landing Page Personnalisée + Email Teaser

---

## 1. VISION GLOBALE

**Concept** : Scraper les offres d'emploi commerciales en France, identifier celles dont les tâches sont automatisables par des agents IA, enrichir les données entreprise, générer une page d'audit personnalisée pour chaque prospect, et envoyer un email teaser ultra-court qui renvoie vers cette page.

**Philosophie** : Sniper, pas carpet bombing. Chaque prospect reçoit sa propre page web d'audit qui prouve qu'un vrai travail d'analyse a été fait. Le mail est un teaser de 3-4 lignes — la page fait tout le travail de conviction.

**Différenciation clé** : Aucun autre prospecteur ne crée une page web dédiée pour chaque prospect. C'est un signal de valeur immédiat et un filtre naturel : si le prospect clique et explore la page, il est déjà qualifié.

**Secteur cible V1** : Commercial / Sales / Prospection / ADV

**Stack principal** : n8n + Claude API (claude-sonnet-4-5) + SerpAPI + Supabase + Next.js (pages) + Brevo + Calendly

---

## 2. CATALOGUE D'AGENTS IA — SECTEUR COMMERCIAL

### Agent 1 : "Prospecteur Outbound"
**Remplace** : SDR, BDR, Téléprospecteur, Chargé de prospection
**Tâches couvertes** :
- Scraping et constitution de listes de prospects qualifiés
- Enrichissement automatique (email, téléphone, LinkedIn, SIRET)
- Séquences multicanales automatisées (email + LinkedIn + relance)
- Scoring et priorisation des leads selon signaux d'engagement
- Personnalisation dynamique des messages à grande échelle
**Stack technique** : n8n + Claude API + Hunter/Apollo + Apify + CRM (HubSpot/Pipedrive)
**ROI argument** : Un SDR traite ~50 leads/jour. L'agent en traite 500+, 7j/7, sans oubli de relance. Coût : ~800€/mois vs 35-45K€/an chargé pour un SDR.
**Mots-clés offres** : SDR, BDR, business developer junior, chargé de prospection, développeur commercial, inside sales

### Agent 2 : "Qualificateur Inbound"
**Remplace** : Commercial sédentaire (partie qualification), assistant commercial (partie lead management)
**Tâches couvertes** :
- Tri et scoring automatique des leads entrants (formulaires, emails, chat)
- Réponses personnalisées automatiques sous < 2 minutes
- Qualification BANT/MEDDIC via conversation IA
- Prise de RDV automatique dans l'agenda des commerciaux
- Routing intelligent vers le bon interlocuteur selon le besoin
- Synchronisation CRM en temps réel
**Stack technique** : n8n + Claude API + Calendly/Cal.com + CRM + Webhook
**ROI argument** : Temps de réponse moyen d'un lead inbound en France : 42h. L'agent répond en < 2 min. Taux de conversion x3 quand réponse < 5 min (étude Harvard Business Review).
**Mots-clés offres** : commercial sédentaire, assistant commercial, chargé de clientèle, gestionnaire leads

### Agent 3 : "Relanceur & Closer Support"
**Remplace** : Chargé de relance, assistant commercial (partie suivi)
**Tâches couvertes** :
- Follow-ups automatiques post-devis (J+2, J+5, J+10, J+20)
- Séquences de nurturing pour leads tièdes (contenu à valeur)
- Détection de signaux de réengagement (ouverture email, visite site)
- Alertes au commercial quand un lead "chaud" se réactive
- Relance des clients dormants avec offres personnalisées
- Reporting pipeline automatique (taux de conversion, délai moyen)
**Stack technique** : n8n + Claude API + CRM + outil emailing (Brevo/Resend)
**ROI argument** : 80% des ventes nécessitent 5+ relances. 44% des commerciaux abandonnent après 1 seul follow-up. L'agent ne lâche jamais.
**Mots-clés offres** : chargé de relance, chargé de recouvrement commercial, assistant commercial, gestionnaire de comptes

### Agent 4 : "Veilleur Commercial"
**Remplace** : Chargé de veille, analyste marché junior, assistant intelligence commerciale
**Tâches couvertes** :
- Monitoring des signaux d'achat (levées de fonds, recrutements, déménagements)
- Alertes sur appels d'offres pertinents
- Veille concurrentielle automatisée (prix, offres, actualités)
- Détection d'opportunités via scraping d'actualités sectorielles
- Rapports hebdomadaires de marché synthétisés par IA
**Stack technique** : n8n + Claude API + Apify + Google Alerts + RSS
**ROI argument** : Un analyste passe 15h/semaine en veille manuelle. L'agent couvre 10x plus de sources en continu, sans fatigue cognitive.
**Mots-clés offres** : chargé de veille, analyste marché, assistant intelligence commerciale, chargé d'études commerciales

### Agent 5 : "Gestionnaire ADV"
**Remplace** : Assistant ADV, gestionnaire des ventes, assistant administration des ventes
**Tâches couvertes** :
- Création et envoi automatique de devis à partir de templates
- Transformation devis → bon de commande → facture
- Suivi des commandes et alertes retard
- Mise à jour automatique des statuts dans l'ERP/CRM
- Gestion des réclamations niveau 1 (accusé réception, routing)
- Reporting des ventes (CA, marges, top clients)
**Stack technique** : n8n + Claude API + ERP/CRM + outil facturation (Pennylane/Sellsy)
**ROI argument** : Un assistant ADV passe 70% de son temps sur des tâches de saisie et de suivi. L'agent élimine les erreurs de saisie et réduit le cycle order-to-cash de 40%.
**Mots-clés offres** : assistant ADV, administration des ventes, gestionnaire commandes, assistant commercial ADV, coordinateur des ventes

---

## 3. ARCHITECTURE DU SYSTÈME — 7 WORKFLOWS N8N

```
┌──────────────────────────────────────────────────────────────────┐
│                      JOBSNIPER SYSTEM V2                          │
│                                                                    │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐                   │
│  │ WF-SCRAPE │──▶│ WF-QUALIF │──▶│ WF-ENRICH │                   │
│  │ Collecte  │   │ Analyse   │   │Enrichissmt│                   │
│  └───────────┘   └───────────┘   └───────────┘                   │
│                                        │                          │
│                                        ▼                          │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐                   │
│  │ WF-SEND   │◀──│ WF-MAIL   │◀──│ WF-MATCH  │                   │
│  │ Envoi     │   │ Teaser    │   │ Matching   │                   │
│  └───────────┘   └───────────┘   └───────────┘                   │
│       │                                │                          │
│       │                                ▼                          │
│       │                          ┌───────────┐                    │
│       │                          │ WF-PAGE   │                    │
│       │                          │ Génération │                    │
│       │                          │ Landing    │                    │
│       │                          └───────────┘                    │
│       │                                                           │
│       ▼                                                           │
│  ┌───────────────────────────────────┐                            │
│  │ WF-TRACK — Tracking & Alertes    │                            │
│  │ Visite page → Alerte Telegram    │                            │
│  │ Clic Calendly → Notification     │                            │
│  └───────────────────────────────────┘                            │
│                                                                    │
│  ┌───────────────────────────────────┐                            │
│  │ INTERFACE MANUELLE (Fallback)     │                            │
│  │ Coller URL/texte → Pipeline       │                            │
│  └───────────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

---

### WF-SCRAPE — Collecte des offres
**Trigger** : CRON quotidien (6h du matin)
**Source** : SerpAPI — Google Jobs endpoint
**Process** :
1. Itérer sur la liste de mots-clés :
   - "SDR", "BDR", "business developer", "chargé de prospection"
   - "assistant commercial", "commercial sédentaire", "inside sales"
   - "chargé de développement commercial", "téléprospecteur"
   - "chargé de relance", "assistant ADV", "administration des ventes"
   - "gestionnaire commandes", "coordinateur des ventes"
2. Pour chaque mot-clé : requête SerpAPI avec localisation "France"
3. Parser les résultats JSON (titre, entreprise, description, lien, localisation, date)
4. Dédupliquer par titre + entreprise (fuzzy matching via Levenshtein ou simple normalisation)
5. Filtrer :
   - EXCLURE : intérim, alternance, stage, fonction publique, armée
   - EXCLURE : offres de + de 15 jours (trop vieilles, probablement pourvues)
   - INCLURE : CDI, CDD longue durée
6. Stocker dans Supabase → table `job_offers` avec statut "new"
**Volume estimé** : 100-300 nouvelles offres/jour
**Coût** : ~50$/mois SerpAPI

---

### WF-QUALIF — Analyse IA des offres
**Trigger** : Webhook déclenché par WF-SCRAPE ou CRON toutes les 2h
**Process** :
1. Récupérer les offres statut "new" depuis Supabase
2. Pour chaque offre → appel Claude API (claude-sonnet-4-5) avec le **PROMPT DE QUALIFICATION**
3. Claude retourne un JSON structuré :

```json
{
  "automation_score": 8,
  "total_tasks": 7,
  "automatable_tasks": 5,
  "automation_ratio": "71%",
  "tasks_analysis": [
    {
      "task": "Qualification de leads entrants par téléphone et email",
      "score": 9,
      "automatable": true,
      "how": "Agent IA de qualification conversationnelle par email/chat, scoring automatique",
      "matching_agent": "qualificateur_inbound"
    },
    {
      "task": "Mise à jour quotidienne du CRM Salesforce",
      "score": 10,
      "automatable": true,
      "how": "Synchronisation automatique via API CRM, enrichissement continu",
      "matching_agent": "prospecteur_outbound"
    },
    {
      "task": "Négociation tarifaire avec les clients grands comptes",
      "score": 2,
      "automatable": false,
      "how": null,
      "matching_agent": null,
      "reason": "Nécessite intelligence émotionnelle, relationnel humain, pouvoir décisionnel"
    }
  ],
  "primary_agent_match": "qualificateur_inbound",
  "secondary_agent_match": "relanceur_closer_support",
  "company_profile_guess": {
    "estimated_size": "50-100 employés",
    "estimated_sector": "SaaS B2B",
    "digital_maturity": "haute",
    "budget_signal": "fort (CDI, salaire affiché 32-38K)"
  },
  "deal_potential": {
    "estimated_ticket": "800-1200€/mois",
    "win_probability": "moyen-fort",
    "reasoning": "Entreprise tech, probablement réceptive à l'IA, bon ratio automatisation"
  },
  "personalization_hooks": [
    "L'offre mentionne 'CRM Salesforce' → on peut proposer une intégration directe",
    "Le poste inclut 'reporting hebdomadaire' → notre agent le fait en temps réel",
    "Ils cherchent quelqu'un 'autonome et rigoureux' → un agent IA est l'incarnation même de ça"
  ],
  "green_flags": ["saisie CRM", "qualification", "emailing", "reporting"],
  "red_flags": ["négociation grands comptes"],
  "go_no_go": "GO"
}
```

4. Filtrage :
   - `automation_score` ≥ 7 ET `automation_ratio` ≥ 60% → statut "qualified"
   - Sinon → statut "archived" avec `rejection_reason`
5. Update Supabase
**Coût** : ~0.15-0.40€ par analyse (Sonnet 4.5, ~2500 tokens in, ~1500 tokens out)

---

### WF-ENRICH — Enrichissement entreprise
**Trigger** : Webhook (offres "qualified")
**Process** :
1. Extraire le nom de l'entreprise depuis l'offre
2. **Societeinfo** (API) :
   - SIRET, forme juridique, date création
   - Dirigeant (nom, prénom, fonction)
   - Effectif, tranche de CA
   - Secteur NAF, adresse
3. **Hunter.io** (API) :
   - Pattern email de l'entreprise
   - Emails trouvés avec noms et postes
   - Ciblage prioritaire : Directeur commercial > CEO > COO > DG > Fondateur
   - Fallback : email générique (contact@, info@) si aucun décideur trouvé
4. **Scraping site web** (HTTP Request n8n) :
   - Récupérer la homepage (title, meta description, H1)
   - Identifier l'activité, les produits/services, le ton de la marque
5. **LinkedIn Company** (Apify, optionnel) :
   - Nombre d'employés LinkedIn, description, secteur
   - Post récents (pour contexte additionnel)
6. **Scoring entreprise** :

| Critère | Points |
|---------|--------|
| Effectif 20-200 | +3 |
| Effectif 10-20 | +1 |
| CA > 2M€ | +3 |
| CA > 500K€ | +1 |
| Secteur B2B | +2 |
| Secteur tech/SaaS | +3 |
| Site web moderne (HTTPS, responsive) | +1 |
| Email décideur trouvé | +3 |
| Email générique seulement | +0 |
| CDI avec salaire affiché > 30K€ | +2 |

   → Score ≥ 7 → statut "enriched"
   → Score 4-6 → statut "low_priority" (à contacter plus tard)
   → Score < 4 → statut "archived"

7. Stocker dans Supabase → table `companies`

---

### WF-MATCH — Matching Agent ↔ Offre
**Trigger** : Webhook (offres "enriched")
**Process** :
1. Récupérer : analyse de l'offre + données entreprise + catalogue d'agents
2. Appel Claude API avec le **PROMPT DE MATCHING**
3. Claude produit :

```json
{
  "primary_agent": {
    "id": "prospecteur_outbound",
    "name": "Agent Prospecteur Outbound",
    "coverage": "78%",
    "tasks_covered": [
      {
        "original_task": "Constitution de fichiers de prospection",
        "agent_capability": "Scraping automatique + enrichissement sur 15+ sources",
        "improvement": "500 leads/jour vs 50 manuellement"
      },
      {
        "original_task": "Envoi de séquences d'emails de prospection",
        "agent_capability": "Séquences multicanales personnalisées par IA",
        "improvement": "Personnalisation à l'échelle, A/B testing automatique"
      }
    ]
  },
  "secondary_agent": {
    "id": "relanceur_closer_support",
    "name": "Agent Relanceur & Closer Support",
    "coverage": "additionnel",
    "tasks_covered": [
      {
        "original_task": "Suivi et relance des prospects contactés",
        "agent_capability": "Séquences de follow-up intelligentes avec détection de signaux",
        "improvement": "Aucun lead oublié, relance au moment optimal"
      }
    ]
  },
  "value_proposition": "Votre futur SDR passera 60% de son temps sur des tâches que notre agent gère déjà : constitution de fichiers, envoi de séquences, mise à jour CRM et suivi des relances. L'agent traite 10x le volume, 7j/7, sans erreur — pour un coût 4x inférieur au salaire prévu.",
  "roi_calculation": {
    "annual_salary_estimated": "35000€",
    "employer_cost_estimated": "47000€",
    "agent_monthly_cost": "900€",
    "agent_annual_cost": "10800€",
    "annual_saving": "36200€",
    "saving_percentage": "77%"
  },
  "objection_preemption": {
    "l_ia_ne_remplace_pas_un_humain": "L'agent ne remplace pas votre commercial — il l'augmente. Les tâches stratégiques (négociation, relation client, closing) restent 100% humaines. L'agent gère tout le reste.",
    "c_est_trop_technique": "Rien à installer, rien à configurer. On met en place, on forme votre équipe en 1h, on maintient le système.",
    "on_a_deja_un_crm": "L'agent s'intègre directement dans votre CRM existant (HubSpot, Salesforce, Pipedrive). Il l'enrichit, il ne le remplace pas."
  }
}
```

4. Update Supabase avec le matching complet
5. Statut → "matched"

---

### WF-PAGE — Génération de la Landing Page Personnalisée ⭐
**Trigger** : Webhook (offres "matched")
**C'est le cœur du système — ce qui nous différencie de tout le monde.**

**Process** :
1. Agrégation de TOUT le contexte : offre + analyse + entreprise + matching + agents
2. Appel Claude API avec le **PROMPT DE GÉNÉRATION DE PAGE**
3. Claude génère le contenu structuré de la page (JSON) :

```json
{
  "page_slug": "techcorp-sdr-mars-2026",
  "company_name": "TechCorp",
  "hero_title": "TechCorp, on a analysé votre offre de SDR.",
  "hero_subtitle": "5 des 7 tâches de ce poste peuvent être gérées par un agent IA. Voici notre audit.",
  "sections": {
    "audit": {
      "title": "Audit de votre offre",
      "job_title": "SDR - Business Developer Junior",
      "total_tasks": 7,
      "automatable_tasks": 5,
      "automation_ratio": "71%",
      "tasks": [
        {
          "name": "Constitution de fichiers de prospection",
          "automatable": true,
          "score": 9,
          "explanation": "Notre agent scrape et enrichit 500+ leads/jour sur 15 sources différentes, avec emails vérifiés et scoring automatique."
        },
        {
          "name": "Négociation grands comptes",
          "automatable": false,
          "score": 2,
          "explanation": "Cette tâche nécessite de l'intelligence émotionnelle et un relationnel humain. Elle reste 100% dans les mains de votre équipe."
        }
      ]
    },
    "solution": {
      "title": "L'agent IA qu'on propose",
      "primary_agent_name": "Agent Prospecteur Outbound",
      "primary_agent_description": "Un système automatisé qui gère toute la chaîne de prospection...",
      "capabilities": ["...", "...", "..."],
      "secondary_agent_name": "Agent Relanceur",
      "secondary_agent_description": "..."
    },
    "roi": {
      "title": "Le calcul est simple",
      "salary_estimated": "35-40K€/an",
      "employer_cost": "~47K€/an chargé",
      "agent_cost": "900€/mois soit 10.8K€/an",
      "saving": "36K€/an",
      "saving_percentage": "77%",
      "bonus_arguments": [
        "Opérationnel en 48h (vs 2-3 mois d'onboarding)",
        "Pas d'arrêt maladie, pas de congés, pas de turnover",
        "Scalable : doublez le volume sans doubler le coût"
      ]
    },
    "proof": {
      "title": "On l'a déjà fait",
      "case_study_teaser": "Un de nos clients dans le secteur [similaire] a automatisé sa prospection outbound. Résultat : 3x plus de leads qualifiés pour un coût divisé par 4.",
      "credibility_points": [
        "Spécialiste en automatisation IA depuis 2022",
        "Basé à Lille, on travaille avec des PME françaises",
        "Stack éprouvée : n8n, Claude AI, intégrations CRM natives"
      ]
    },
    "cta": {
      "title": "On en parle 15 minutes ?",
      "subtitle": "Sans engagement. On vous montre concrètement comment l'agent fonctionne sur VOS données.",
      "calendly_url": "https://calendly.com/raph-gralt/15min"
    }
  }
}
```

4. **Génération technique de la page** :
   - Application Next.js hébergée sur audit.gralt.fr
   - Route dynamique : `audit.gralt.fr/[slug]`
   - La page récupère les données depuis Supabase via l'API
   - Template React unique avec données injectées dynamiquement
   - Dark theme premium Gralt
   - Animations au scroll (sections apparaissent progressivement)
   - Responsive mobile-first
   - Calendly embed en bas de page
   - Tracking intégré (voir WF-TRACK)

5. Stocker le contenu de la page dans Supabase → table `landing_pages`
6. Vérifier que la page est accessible → test HTTP
7. Statut → "page_ready"

**Structure de la page** (scroll vertical) :
```
┌─────────────────────────────────────────┐
│ HERO                                     │
│ "[Entreprise], on a analysé votre offre" │
│ "X/Y tâches automatisables"             │
│ Logo Gralt discret en haut               │
├─────────────────────────────────────────┤
│ SECTION 1 : AUDIT                        │
│ Tableau visuel des tâches                │
│ ✅ Automatisable / ❌ Humain requis      │
│ Score de chaque tâche avec explication   │
│ Barre de progression "71% automatisable" │
├─────────────────────────────────────────┤
│ SECTION 2 : LA SOLUTION                  │
│ Carte(s) de l'agent IA proposé           │
│ Capacités listées, stack technique       │
│ Comment il gère chaque tâche             │
├─────────────────────────────────────────┤
│ SECTION 3 : ROI                          │
│ Comparaison visuelle Salaire vs Agent    │
│ Économie annuelle mise en avant          │
│ Arguments bonus (rapidité, fiabilité)    │
├─────────────────────────────────────────┤
│ SECTION 4 : CRÉDIBILITÉ                 │
│ Mini case study                          │
│ Points de crédibilité Gralt             │
├─────────────────────────────────────────┤
│ SECTION 5 : CTA                         │
│ "On en parle 15 min ?"                  │
│ Embed Calendly                           │
│ Alternative : email direct               │
├─────────────────────────────────────────┤
│ FOOTER                                   │
│ Gralt — Automatisation IA pour PME      │
│ Lille, France                            │
└─────────────────────────────────────────┘
```

---

### WF-MAIL — Rédaction du mail teaser
**Trigger** : Webhook (offres "page_ready")
**Process** :
1. Récupérer le contexte + l'URL de la page générée
2. Appel Claude API avec le **PROMPT DE RÉDACTION EMAIL**
3. Claude produit :

```json
{
  "subject_lines": [
    "Votre offre de SDR — 71% automatisable",
    "[TechCorp] On a audité votre offre de SDR",
    "5 tâches sur 7 gérées par une IA — votre offre de SDR"
  ],
  "email_body": "Bonjour [Prénom],\n\nVous cherchez un SDR pour gérer la prospection et le suivi CRM chez TechCorp.\n\nOn a analysé votre offre en détail : 5 des 7 tâches listées sont automatisables par un agent IA — pour un coût 4x inférieur au poste.\n\nL'audit complet est ici : [LIEN]\n\nRaph — Gralt, automatisation IA",
  "follow_up_1_j3": {
    "subject": "Re: Votre offre de SDR",
    "body": "[Prénom],\n\nJe vous ai envoyé l'audit de votre offre de SDR il y a quelques jours.\n\nLe point clé : la constitution de fichiers + les séquences d'emailing + le suivi CRM représentent environ 60% du poste — et c'est exactement ce que notre agent fait, 7j/7.\n\nÇa vaut 15 min d'échange ?\n\n[LIEN vers la page]\n\nRaph"
  },
  "follow_up_2_j7": {
    "subject": "Question rapide — [TechCorp]",
    "body": "[Prénom],\n\nUne question directe : si vous pouviez automatiser la prospection et le suivi pour que votre prochain commercial se concentre uniquement sur le closing — ça changerait quoi pour vous ?\n\nC'est ce qu'on fait. L'audit de votre offre est toujours dispo ici : [LIEN]\n\nRaph"
  },
  "follow_up_3_j14_breakup": {
    "subject": "Pas le bon moment ?",
    "body": "[Prénom],\n\nSi le timing ne colle pas, aucun souci — je ne vais pas insister.\n\nL'audit de votre offre de SDR reste accessible ici si ça devient pertinent plus tard : [LIEN]\n\nBonne continuation,\nRaph"
  }
}
```

4. **Règles de rédaction du mail teaser** :
   - MAX 60 mots pour le mail principal (3-5 lignes)
   - Le mail ne vend rien — il donne envie de cliquer sur le lien
   - Mentionner 1 chiffre concret (ratio automatisation ou ROI)
   - INTERDICTIONS :
     - "Bonjour Madame/Monsieur" → utiliser le prénom
     - "Je me permets de" → supprimé
     - "N'hésitez pas" → supprimé
     - "Cordialement" → juste le prénom
     - "Suite à" → supprimé
     - Emojis → jamais
     - HTML lourd → texte brut uniquement (meilleure délivrabilité)
   - Le lien doit être le seul élément cliquable
   - Signature minimaliste : "Raph — Gralt, automatisation IA"

5. Stocker dans Supabase → table `email_campaigns`
6. Statut → "ready_to_send"

---

### WF-SEND — Envoi et séquence
**Trigger** : CRON quotidien à 9h (mardi, mercredi, jeudi uniquement)
**Process** :
1. Récupérer les emails "ready_to_send" + les follow-ups programmés
2. **Règles de volume** :
   - Semaines 1-2 (warm-up déjà fait via Lemlist Warm pendant 1 mois) : 5 emails/jour
   - Semaines 3-4 : 10 emails/jour
   - Mois 2+ : 15 emails/jour max
   - JAMAIS plus de 15/jour (délivrabilité)
3. Envoi via **Brevo API** (SMTP transactionnel) :
   - Format : texte brut (pas de HTML, pas d'images)
   - Un seul lien : l'URL de la page d'audit
   - Headers SPF + DKIM + DMARC vérifiés
4. Séquence automatique :
   - J+0 : Mail principal
   - J+3 : Follow-up 1 (si pas d'ouverture)
   - J+7 : Follow-up 2 (si ouverture mais pas de réponse)
   - J+14 : Follow-up 3 breakup (dernier mail)
   - **STOP immédiat** si : réponse reçue OU clic Calendly détecté
5. Enregistrer chaque envoi dans Supabase → table `email_campaigns`
6. **Domaine d'envoi** : domaine secondaire chauffé via Lemlist Warm (ex: gralt-consulting.fr)

---

### WF-TRACK — Tracking des pages et alertes ⭐
**Trigger** : Webhooks en temps réel
**C'est le workflow qui transforme une page statique en outil de vente actif.**

**Ce qu'on tracke** :
1. **Visite de la page** : timestamp, durée, scroll depth, device, IP → géolocalisation approximative
2. **Clic sur le CTA Calendly** : le prospect a cliqué pour booker
3. **Booking Calendly confirmé** : un call est programmé
4. **Ouverture email** (pixel Brevo) : le mail a été ouvert
5. **Clic email** (tracking Brevo) : le lien a été cliqué

**Alertes en temps réel via Telegram** :
- 🟡 "[Entreprise] a ouvert votre mail" (info)
- 🟠 "[Entreprise] a visité la page d'audit — temps passé : 2min34" (signal chaud)
- 🔴 "[Entreprise] a cliqué sur Calendly !" (très chaud)
- 🟢 "[Entreprise] a booké un call le [date] à [heure]" (converti)

**Implémentation technique du tracking** :
- Script JS léger sur la page Next.js → envoie des events à un endpoint n8n webhook
- Events : `page_view`, `scroll_25`, `scroll_50`, `scroll_75`, `scroll_100`, `cta_click`, `time_on_page`
- Stockage dans Supabase → table `page_analytics`
- Webhook Calendly → notification booking

**Intelligence ajoutée** :
- Si un prospect visite la page 2+ fois → alerte spéciale "prospect très intéressé"
- Si un prospect visite la page mais ne booke pas → déclencher follow-up anticipé
- Si un prospect passe > 3 min sur la page → signal d'intérêt fort

---

## 4. APPLICATION WEB — audit.gralt.fr

### Architecture technique
- **Framework** : Next.js (App Router)
- **Hébergement** : VPS Hostinger existant (Docker/Traefik)
- **Base de données** : Supabase (existant)
- **Domaine** : audit.gralt.fr (sous-domaine de gralt.fr)
- **SSL** : Let's Encrypt via Traefik

### Routes
- `audit.gralt.fr/[slug]` → page d'audit personnalisée (publique)
- `audit.gralt.fr/dashboard` → tableau de bord privé pour Raph (protégé)

### Page d'audit personnalisée — Spécifications design

**Theme** : Dark premium (cohérent avec l'identité Gralt/Vedet)
- Background : noir profond (#0A0A0F) avec subtle gradient
- Accent primaire : blanc (#FFFFFF) pour le texte principal
- Accent secondaire : couleur signature Gralt (à définir, suggestion : bleu électrique #3B82F6 ou vert émeraude #10B981)
- Cards : fond légèrement plus clair (#12121A) avec border subtle
- Typographie : font display élégante (Clash Display / Cabinet Grotesk / Satoshi) + body clean

**Animations** :
- Sections apparaissent au scroll (fade-in + slide-up)
- Barre de progression du ratio d'automatisation : animation de remplissage
- Score de chaque tâche : compteur animé
- Comparaison ROI : barres qui se remplissent en parallèle
- CTA : légère pulsation ou glow effect

**Éléments de la page** :
1. **Navbar** : Logo Gralt discret + lien retour gralt.fr
2. **Hero** : Titre avec nom de l'entreprise, sous-titre avec le ratio, fond gradient
3. **Section Audit** : Cards pour chaque tâche avec badge vert/rouge, score, explication
4. **Section Solution** : Carte(s) agent avec icônes, capacités, stack
5. **Section ROI** : Comparaison visuelle colonnes, chiffre économie en gros
6. **Section Crédibilité** : Témoignage/case study + badges Gralt
7. **Section CTA** : Texte accrocheur + Calendly embed inline
8. **Footer** : Minimaliste — Gralt, Lille, lien site

### Dashboard privé — Spécifications

**URL** : audit.gralt.fr/dashboard (protégé par auth simple)
**Contenu** :
- Vue pipeline : combien d'offres à chaque étape (new → qualified → enriched → matched → page_ready → sent → opened → visited → booked → converted)
- Liste des prospects avec statut, score, dernière action
- Alertes récentes (visites de pages, ouvertures)
- Stats globales : taux d'ouverture, taux de visite page, taux de booking
- Actions rapides : valider un mail avant envoi, relancer manuellement

---

## 5. BASE DE DONNÉES SUPABASE — Schéma complet

### Table `job_offers`
```sql
CREATE TABLE job_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  source_url TEXT,
  source_platform TEXT DEFAULT 'google_jobs',
  salary_min INTEGER,
  salary_max INTEGER,
  contract_type TEXT DEFAULT 'CDI',
  date_posted DATE,
  date_scraped TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'enriched', 'matched', 'page_ready', 'ready_to_send', 'sent', 'opened', 'visited', 'booked', 'converted', 'archived', 'low_priority')),
  automation_score INTEGER CHECK (automation_score BETWEEN 1 AND 10),
  automation_ratio DECIMAL,
  tasks_analysis JSONB,
  matching_result JSONB,
  personalization_hooks JSONB,
  rejection_reason TEXT,
  company_id UUID REFERENCES companies(id),
  landing_page_id UUID REFERENCES landing_pages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `companies`
```sql
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  siret TEXT,
  sector_naf TEXT,
  sector_label TEXT,
  revenue_bracket TEXT,
  employee_count INTEGER,
  city TEXT,
  region TEXT,
  website TEXT,
  website_description TEXT,
  linkedin_url TEXT,
  decision_maker_name TEXT,
  decision_maker_email TEXT,
  decision_maker_title TEXT,
  decision_maker_firstname TEXT,
  fallback_email TEXT,
  company_score INTEGER CHECK (company_score BETWEEN 1 AND 15),
  enrichment_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `agents_catalog`
```sql
CREATE TABLE agents_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  replaces_roles JSONB,
  tasks_covered JSONB,
  stack TEXT,
  monthly_cost_estimate INTEGER,
  roi_arguments JSONB,
  keywords_matching JSONB,
  case_studies JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `landing_pages`
```sql
CREATE TABLE landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  job_offer_id UUID REFERENCES job_offers(id),
  company_id UUID REFERENCES companies(id),
  page_content JSONB NOT NULL,
  url TEXT GENERATED ALWAYS AS ('https://audit.gralt.fr/' || slug) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `email_campaigns`
```sql
CREATE TABLE email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_offer_id UUID REFERENCES job_offers(id),
  company_id UUID REFERENCES companies(id),
  landing_page_id UUID REFERENCES landing_pages(id),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_firstname TEXT,
  subject_line TEXT NOT NULL,
  email_body TEXT NOT NULL,
  follow_up_1 JSONB,
  follow_up_2 JSONB,
  follow_up_3 JSONB,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'sent', 'opened', 'clicked', 'visited', 'replied', 'booked', 'converted', 'unsubscribed')),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `page_analytics`
```sql
CREATE TABLE page_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID REFERENCES landing_pages(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100', 'cta_click', 'calendly_click', 'time_update')),
  visitor_ip TEXT,
  visitor_city TEXT,
  visitor_device TEXT,
  time_on_page INTEGER,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. PROMPTS — STRUCTURE DÉTAILLÉE

### PROMPT 1 : Qualification de l'offre (WF-QUALIF)
**Modèle** : claude-sonnet-4-5
**System prompt** : Tu es un expert en automatisation IA spécialisé dans les processus commerciaux. Tu analyses des offres d'emploi pour déterminer si les tâches décrites peuvent être automatisées par des agents IA. Tu es extrêmement précis et tu ne surestimes jamais le potentiel d'automatisation. Si une tâche nécessite du relationnel humain complexe, de la créativité stratégique ou de la présence physique, tu le dis clairement.
**Variables injectées** : {job_title}, {company_name}, {job_description}, {location}
**Format de sortie** : JSON structuré (voir section WF-QUALIF)
**Critères de scoring détaillés** :
- Score 9-10 : Tâche 100% automatisable (saisie données, envoi emails templates, mise à jour CRM, reporting)
- Score 7-8 : Très automatisable avec supervision légère (qualification leads, rédaction emails personnalisés, enrichissement données)
- Score 5-6 : Partiellement automatisable (support client textuel, tri de demandes, résumés de réunions)
- Score 3-4 : Faiblement automatisable (négociation simple, accompagnement client, formation)
- Score 1-2 : Non automatisable (négociation complexe, management, déplacement terrain, relationnel stratégique)

### PROMPT 2 : Matching Agent ↔ Offre (WF-MATCH)
**Modèle** : claude-sonnet-4-5
**System prompt** : Tu es le directeur commercial de Gralt, une agence d'automatisation IA. Tu connais parfaitement le catalogue de 5 agents IA de Gralt. Ton rôle est de faire le matching parfait entre les tâches d'une offre d'emploi et les capacités de nos agents. Tu calcules le ROI de manière réaliste et tu anticipes les objections. Si le matching est faible (< 60% de couverture), tu recommandes de NE PAS contacter.
**Variables injectées** : {tasks_analysis}, {company_data}, {agents_catalog}
**Format de sortie** : JSON structuré (voir section WF-MATCH)

### PROMPT 3 : Génération du contenu de la page (WF-PAGE)
**Modèle** : claude-sonnet-4-5
**System prompt** : Tu es un expert en copywriting B2B et en conversion. Tu rédiges le contenu d'une page d'audit personnalisée qui sera envoyée à un décideur d'entreprise. Le ton est direct, professionnel, sans bullshit. Tu ne vends pas du rêve — tu montres des faits, des chiffres, des capacités concrètes. Le contenu doit être suffisamment détaillé pour être crédible mais suffisamment concis pour être lu en 3 minutes maximum. Tu utilises le vouvoiement.
**Variables injectées** : {company_name}, {job_title}, {tasks_analysis}, {matching_result}, {company_data}, {agent_details}
**Format de sortie** : JSON structuré (voir section WF-PAGE)

### PROMPT 4 : Rédaction du mail teaser (WF-MAIL)
**Modèle** : claude-sonnet-4-5
**System prompt** : Tu es un expert en cold email B2B. Tu rédiges des emails ultra-courts (60 mots max) dont le seul objectif est de faire cliquer le destinataire sur un lien. Tu ne vends rien dans le mail — tu donnes juste assez d'information pour créer la curiosité. Tu écris comme un entrepreneur qui parle à un autre entrepreneur : direct, humain, pas corporate. Tu tutoies jamais. Tu vouvoies sans être rigide.
**Variables injectées** : {recipient_firstname}, {company_name}, {job_title}, {automation_ratio}, {key_stat}, {page_url}
**Format de sortie** : JSON structuré (voir section WF-MAIL)
**Règles strictes** :
- Mail principal : 60 mots MAX
- Objet : 8 mots MAX
- UN SEUL lien dans le mail (la page d'audit)
- Pas de HTML, texte brut uniquement
- Pas de pièce jointe
- Pas d'image, pas de logo
- Signature : "Raph — Gralt, automatisation IA" (toujours la même)

---

## 7. ESTIMATIONS RÉVISÉES — AVEC LANDING PAGE

### Comparaison email classique vs email + landing page

| Métrique | Email classique | Email teaser + Page |
|----------|----------------|-------------------|
| Taux d'ouverture | 40-50% | 50-65% (objet plus intrigant) |
| Taux de clic (sur lien) | N/A | 20-35% (des ouvertures) |
| Taux de réponse | 8-12% | 12-20% (qualification par la page) |
| Qualité des réponses | Mixte | Haute (le prospect a lu l'audit) |
| Taux de booking | 40-50% des réponses | 60-75% des réponses |
| Délivrabilité | Moyenne (mail long) | Haute (mail court, texte brut) |

### Pourquoi c'est mieux :
1. Le mail court passe mieux les filtres spam
2. Le prospect qui clique s'est déjà pré-qualifié
3. La page fait le travail de conviction (pas le mail)
4. Le tracking de page donne des signaux impossibles à avoir par email seul
5. Le prospect peut booker directement sans répondre au mail (Calendly)
6. La page est partageable en interne ("Regarde ce qu'on a reçu")

### Projection chiffrée révisée — 1 mois
- 300 offres scrapées / semaine → 1200 / mois
- ~60 qualifiées / semaine (score ≥ 7) → ~240 / mois
- ~40 enrichies et scorées / semaine → ~160 / mois
- 15 emails envoyés / semaine (cap) → ~60 / mois
- Taux d'ouverture 55% → ~33 ouvertures / mois
- Taux de clic 25% → ~8 visites de page / mois
- Taux de booking 30% des visites → **2-3 calls / mois**
- Taux de conversion 30% → **1 client / mois minimum**
- En comptant les réponses directes au mail : **+1-2 calls supplémentaires**
- **Total réaliste : 3-5 calls/mois, 1-2 clients/mois**

### Revenu estimé
- Ticket moyen : 800-1500€/mois récurrent ou 5000-12000€ en setup
- Mois 1-2 : 1-2 clients → 1500-3000€/mois
- Mois 6 : 8-12 clients récurrents → 10-15K€/mois
- Investissement mensuel système : ~300€/mois
- **ROI du système : rentabilisé dès le 1er client**

---

## 8. PLAN DE DÉVELOPPEMENT RÉVISÉ

### Phase 0 : Préparation (Maintenant — Semaine 0)
- [ ] Acheter le domaine secondaire (gralt-consulting.fr ou similaire)
- [ ] Configurer SPF + DKIM + DMARC sur le domaine secondaire
- [ ] Lancer Lemlist Warm (1 mois de chauffe)
- [ ] Configurer le sous-domaine audit.gralt.fr (DNS + Traefik sur VPS)
- [ ] Créer un compte SerpAPI
- [ ] Créer un compte Societeinfo
- [ ] Vérifier le compte Hunter.io

### Phase 1 : Base de données + Catalogue (Semaine 1)
- [ ] Créer toutes les tables Supabase
- [ ] Remplir `agents_catalog` avec les 5 fiches agents complètes
- [ ] Tester les APIs : SerpAPI, Societeinfo, Hunter, Brevo
- [ ] Setup du projet Next.js pour audit.gralt.fr

### Phase 2 : Les cerveaux (Semaine 2)
- [ ] Rédiger le PROMPT DE QUALIFICATION (le plus critique) — tester sur 30 offres réelles
- [ ] Rédiger le PROMPT DE MATCHING — tester sur les 30 mêmes offres
- [ ] Rédiger le PROMPT DE PAGE — tester sur 10 offres sélectionnées
- [ ] Rédiger le PROMPT DE MAIL — tester sur 10 offres sélectionnées
- [ ] Itérer sur chaque prompt jusqu'à qualité parfaite

### Phase 3 : La landing page (Semaine 2-3)
- [ ] Développer le template React/Next.js de la page d'audit
- [ ] Intégrer le dark theme premium
- [ ] Intégrer Calendly embed
- [ ] Implémenter le tracking JS (events → webhook n8n)
- [ ] Tester sur 5 pages fictives
- [ ] Développer le dashboard basique

### Phase 4 : Les workflows n8n (Semaine 3-4)
- [ ] WF-SCRAPE : collecte automatique Google Jobs
- [ ] WF-QUALIF : analyse IA
- [ ] WF-ENRICH : enrichissement entreprise
- [ ] WF-MATCH : matching agents
- [ ] WF-PAGE : génération de page
- [ ] WF-MAIL : rédaction mail teaser
- [ ] WF-SEND : envoi + séquence follow-up
- [ ] WF-TRACK : tracking + alertes Telegram

### Phase 5 : Test et lancement (Semaine 5)
- [ ] Pipeline complet end-to-end sur 20 offres réelles
- [ ] Revue manuelle de chaque page générée
- [ ] Revue manuelle de chaque mail généré
- [ ] Envoi des 5-10 premiers mails (sélection manuelle des meilleurs)
- [ ] Analyse des premiers résultats
- [ ] Itération

### Phase 6 : Montée en puissance (Semaine 6+)
- [ ] Augmentation progressive du volume (10 → 15/jour)
- [ ] A/B testing des objets de mail
- [ ] Optimisation des prompts basée sur les résultats
- [ ] Ajout de l'interface manuelle (fallback)

---

## 9. BUDGET ESTIMÉ MENSUEL (V2)

| Poste | Coût estimé | Notes |
|-------|-------------|-------|
| SerpAPI (Google Jobs) | 50$/mois | 5000 recherches/mois |
| Claude API (Sonnet 4.5) | 50-120€/mois | 4 appels/offre, ~60 offres/semaine |
| Hunter.io | 49€/mois | Starter plan |
| Societeinfo | ~30€/mois | Pay-per-use |
| Brevo (email) | 25€/mois | Lite plan |
| Apify | 49$/mois | LinkedIn enrichissement |
| Domaine secondaire | 10€/an | gralt-consulting.fr |
| Lemlist Warm | 29$/mois | Warm-up email |
| VPS Hostinger (existant) | 0€ | Déjà payé |
| Calendly | 0€ | Plan gratuit suffisant |
| Supabase (existant) | 0€ | Free tier ou déjà payé |
| **TOTAL** | **~300-400€/mois** |

→ **Rentabilisé dès le premier client.**
→ **ROI potentiel : x10 à x30 dès le mois 3**

---

## 10. ROADMAP FUTURE

### V2 (Mois 3-4) — Multicanal
- Ajout LinkedIn dans la séquence (visite profil → mail → connexion)
- Scoring dynamique basé sur les résultats réels
- A/B testing automatique des pages (variation de titres, CTA)

### V3 (Mois 5-6) — Nouveaux secteurs
- Extension : Administratif / Secrétariat
- Extension : Support Client
- Extension : Comptabilité / Gestion
- Nouveaux agents dans le catalogue pour chaque secteur

### V4 (Mois 6+) — Scale & Automation
- Vidéo personnalisée via HeyGen/Synthesia dans la page
- Intégration CRM automatique (Pipedrive)
- Système de referral (client existant → recommandation)
- Interface web complète pour gérer tout le pipeline sans toucher n8n
