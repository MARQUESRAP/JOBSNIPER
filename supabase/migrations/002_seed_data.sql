-- ============================================
-- SEED DATA — Agents Catalog
-- ============================================

INSERT INTO agents_catalog (slug, name, replaces_roles, tasks_covered, stack, monthly_cost_estimate, roi_arguments, keywords_matching, case_studies) VALUES

-- Agent 1: Prospecteur Outbound
('prospecteur_outbound', 'Prospecteur Outbound',
  '["SDR", "BDR", "Business Developer Junior", "Chargé de prospection", "Développeur commercial"]'::jsonb,
  '["Scraping de listes de leads ciblés (500+/jour depuis 15+ sources)", "Enrichissement email et données contact", "Séquences email multicanal personnalisées par IA", "Lead scoring automatique", "Mise à jour CRM automatique", "A/B testing des séquences", "Reporting quotidien et hebdomadaire"]'::jsonb,
  'n8n, Claude API, Hunter.io, Apollo.io, Apify, Dropcontact, HubSpot/Pipedrive/Salesforce',
  '600-1000',
  '["Traite 500+ leads/jour vs 50 en manuel", "Coût de 800€/mois vs 35-45K€/an pour un SDR", "Opérationnel en 1-2 semaines vs 2-3 mois d''onboarding", "Disponible 24/7, pas de turnover", "Scalable sans surcoût proportionnel"]'::jsonb,
  '["SDR", "BDR", "business developer junior", "chargé de prospection", "développeur commercial", "prospection commerciale", "cold calling", "cold emailing"]'::jsonb,
  '[{"sector": "SaaS B2B", "size": "PME 30 personnes", "result": "3x plus de leads qualifiés en 1 mois", "detail": "Passage de 50 à 180 leads qualifiés par semaine, avec un taux de réponse de 12% contre 4% en manuel."}]'::jsonb
),

-- Agent 2: Qualificateur Inbound
('qualificateur_inbound', 'Qualificateur Inbound',
  '["Commercial sédentaire (qualification)", "Assistant commercial (gestion leads)", "Chargé de clientèle", "Gestionnaire leads"]'::jsonb,
  '["Réponse automatique aux leads entrants en moins de 2 minutes", "Qualification structurée (BANT/MEDDIC)", "Scoring automatique", "Prise de rendez-vous automatique", "Routing intelligent vers le bon commercial", "Synchronisation CRM temps réel", "Alertes leads à fort potentiel"]'::jsonb,
  'n8n, Claude API, Calendly/Cal.com, CRM, Webhooks, APIs email',
  '600-900',
  '["Temps de réponse moyen en France : 42h — l''agent répond en <2min", "3x plus de conversion quand réponse <5min (étude HBR)", "Qualification 24/7 sans interruption", "0 lead oublié ou mal routé", "Intégration native avec les CRM du marché"]'::jsonb,
  '["commercial sédentaire", "assistant commercial", "chargé de clientèle", "gestionnaire leads", "inside sales", "qualification", "lead management"]'::jsonb,
  '[{"sector": "Services B2B", "size": "PME 45 personnes", "result": "Temps de réponse passé de 6h à 90 secondes", "detail": "Taux de conversion des leads entrants augmenté de 18% à 34% en 6 semaines."}]'::jsonb
),

-- Agent 3: Relanceur & Closer Support
('relanceur_closer_support', 'Relanceur & Closer Support',
  '["Chargé de relance", "Assistant commercial (volet relance)", "Chargé de recouvrement", "Gestionnaire de comptes"]'::jsonb,
  '["Séquences de relance automatiques post-devis (J+2, J+5, J+10, J+20)", "Nurturing des leads tièdes avec contenu de valeur", "Détection de signaux d''engagement", "Alertes temps réel sur leads chauds", "Relance de clients dormants", "Relance d''impayés", "Reporting pipeline complet"]'::jsonb,
  'n8n, Claude API, CRM, Brevo/Resend, tracking web',
  '500-800',
  '["80% des ventes nécessitent 5+ relances — 44% des commerciaux abandonnent après 1", "Relances personnalisées par IA, pas de templates génériques", "Détection automatique du meilleur moment pour relancer", "0 devis oublié dans le pipeline", "Récupération de 15-25% des devis perdus"]'::jsonb,
  '["chargé de relance", "chargé de recouvrement", "gestionnaire de comptes", "assistant commercial", "suivi commercial", "relance client"]'::jsonb,
  '[{"sector": "Industrie B2B", "size": "PME 60 personnes", "result": "25% des devis perdus récupérés", "detail": "Sur 3 mois, récupération de 45K€ de devis considérés comme perdus grâce aux séquences de relance intelligentes."}]'::jsonb
),

-- Agent 4: Veilleur Commercial
('veilleur_commercial', 'Veilleur Commercial',
  '["Chargé de veille", "Analyste marché junior", "Assistant intelligence commerciale"]'::jsonb,
  '["Monitoring continu des signaux d''achat (levées de fonds, recrutements massifs, déménagements, changements de direction)", "Alertes appels d''offres", "Veille concurrentielle", "Scraping de news avec résumés IA quotidiens", "Rapports marché hebdomadaires", "Détection opportunités cross-sell/upsell"]'::jsonb,
  'n8n, Claude API, Apify, Google Alerts, flux RSS, APIs presse',
  '500-800',
  '["Un analyste passe 15h/semaine en veille manuelle — l''agent couvre 10x plus de sources en continu", "Détection de signaux en temps réel vs rapport mensuel", "Couverture exhaustive : presse, LinkedIn, registres légaux, offres d''emploi", "Rapports structurés et actionnables", "Ne manque jamais un signal critique"]'::jsonb,
  '["chargé de veille", "analyste marché", "assistant intelligence commerciale", "veille concurrentielle", "intelligence économique"]'::jsonb,
  '[{"sector": "Conseil B2B", "size": "PME 25 personnes", "result": "4 opportunités détectées par semaine vs 1 en manuel", "detail": "Identification précoce d''un appel d''offres de 120K€ grâce au monitoring automatique des signaux."}]'::jsonb
),

-- Agent 5: Gestionnaire ADV
('gestionnaire_adv', 'Gestionnaire ADV',
  '["Assistant ADV", "Administration des ventes", "Gestionnaire commandes", "Coordinateur commercial"]'::jsonb,
  '["Génération automatique de devis depuis templates", "Transformation devis → commande → facture", "Suivi de commandes en temps réel", "Mise à jour automatique des statuts ERP/CRM", "Gestion des réclamations niveau 1", "Reporting commercial automatique", "Archivage documentaire automatique"]'::jsonb,
  'n8n, Claude API, ERP/CRM, Pennylane/Sellsy, APIs facturation',
  '600-1000',
  '["Les assistants ADV passent 70% de leur temps en saisie/suivi", "Élimine les erreurs de saisie", "Réduit le cycle order-to-cash de 40%", "Traçabilité complète de chaque commande", "Scalable : traite 10 ou 1000 commandes avec la même efficacité"]'::jsonb,
  '["assistant ADV", "administration des ventes", "gestionnaire commandes", "coordinateur commercial", "assistant commercial ADV", "gestion des commandes"]'::jsonb,
  '[{"sector": "Distribution B2B", "size": "PME 80 personnes", "result": "Cycle de facturation réduit de 5 jours à 24h", "detail": "Automatisation complète du flux devis-commande-facture, réduisant les erreurs de saisie de 95% et libérant 25h/semaine pour l''équipe."}]'::jsonb
);

-- ============================================
-- SEED DATA — Test Companies
-- ============================================

INSERT INTO companies (id, name, city, region, website, employee_count, revenue_bracket, naf_sector, decision_maker_name, decision_maker_email, decision_maker_title, company_score) VALUES
('a1000000-0000-0000-0000-000000000001', 'TechSolutions SAS', 'Lyon', 'Auvergne-Rhône-Alpes', 'https://techsolutions.example.fr', '45', '2-5M€', 'Éditeur de logiciels', 'Marc Dupont', 'marc.dupont@techsolutions.example.fr', 'Directeur Commercial', 11),
('a1000000-0000-0000-0000-000000000002', 'LogiPro France', 'Bordeaux', 'Nouvelle-Aquitaine', 'https://logipro.example.fr', '120', '10-20M€', 'Logistique et transport', 'Sophie Martin', 'sophie.martin@logipro.example.fr', 'DAF', 12),
('a1000000-0000-0000-0000-000000000003', 'ConseilPlus', 'Nantes', 'Pays de la Loire', 'https://conseilplus.example.fr', '18', '1-2M€', 'Conseil en gestion', 'Antoine Leroy', 'antoine.leroy@conseilplus.example.fr', 'Gérant', 7);

-- ============================================
-- SEED DATA — Test Job Offers
-- ============================================

INSERT INTO job_offers (id, title, company_name, company_id, description, location, status, automation_score, automation_ratio, contract_type, salary_min, salary_max) VALUES
('b1000000-0000-0000-0000-000000000001', 'SDR - Business Developer Junior', 'TechSolutions SAS', 'a1000000-0000-0000-0000-000000000001', 'Nous recherchons un SDR pour développer notre portefeuille client B2B SaaS.', 'Lyon', 'page_ready', 8, 71.43, 'CDI', 28000, 35000),
('b1000000-0000-0000-0000-000000000002', 'Assistant ADV', 'LogiPro France', 'a1000000-0000-0000-0000-000000000002', 'Poste d''assistant administration des ventes pour notre département logistique.', 'Bordeaux', 'page_ready', 9, 85.71, 'CDI', 26000, 32000),
('b1000000-0000-0000-0000-000000000003', 'Chargé de clientèle', 'ConseilPlus', 'a1000000-0000-0000-0000-000000000003', 'Chargé de clientèle pour accompagner nos clients PME dans leurs projets de conseil.', 'Nantes', 'page_ready', 6, 50.00, 'CDI', 30000, 38000);

-- ============================================
-- SEED DATA — Test Landing Pages
-- ============================================

INSERT INTO landing_pages (id, slug, job_offer_id, company_id, is_active, page_content) VALUES

-- Page 1: TechSolutions SAS — SDR
('c1000000-0000-0000-0000-000000000001', 'techsolutions-sdr-mars-2026', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', true, '{
  "meta": {
    "title": "TechSolutions SAS — Audit IA de votre poste de SDR | Gralt",
    "description": "5 des 7 tâches de votre poste de SDR sont automatisables par un agent IA. Découvrez l''audit personnalisé de Gralt."
  },
  "hero": {
    "title": "TechSolutions, on a analysé votre offre de SDR.",
    "subtitle": "5 des 7 tâches de ce poste sont automatisables par un agent IA."
  },
  "audit_section": {
    "section_title": "Audit de votre offre",
    "intro": "Nous avons décortiqué chaque tâche de votre offre de Business Developer Junior pour évaluer son potentiel d''automatisation.",
    "tasks": [
      {
        "name": "Constitution de listes de prospects ciblés",
        "automatable": true,
        "score": 9,
        "explanation": "Le scraping et l''enrichissement de listes de leads depuis LinkedIn, bases sectorielles et annuaires est entièrement automatisable. L''agent traite 500+ leads par jour contre 50 en manuel.",
        "agent_slug": "prospecteur_outbound"
      },
      {
        "name": "Envoi de séquences email de prospection",
        "automatable": true,
        "score": 9,
        "explanation": "Les séquences multicanal personnalisées (email, LinkedIn) avec A/B testing automatique sont le coeur de métier de l''agent. Chaque message est adapté au contexte du prospect.",
        "agent_slug": "prospecteur_outbound"
      },
      {
        "name": "Mise à jour et suivi CRM",
        "automatable": true,
        "score": 10,
        "explanation": "La saisie CRM, la mise à jour des statuts et le suivi des interactions sont 100% automatisables. Zéro oubli, zéro retard de mise à jour.",
        "agent_slug": "prospecteur_outbound"
      },
      {
        "name": "Qualification et scoring des leads",
        "automatable": true,
        "score": 8,
        "explanation": "Le scoring basé sur des critères définis (taille, secteur, signaux d''achat) et la qualification BANT sont automatisables avec une précision supérieure au tri manuel.",
        "agent_slug": "prospecteur_outbound"
      },
      {
        "name": "Reporting hebdomadaire d''activité",
        "automatable": true,
        "score": 9,
        "explanation": "Les rapports d''activité (nombre de contacts, taux de réponse, pipeline) sont générés automatiquement chaque semaine avec des insights actionnables.",
        "agent_slug": "prospecteur_outbound"
      },
      {
        "name": "Négociation et closing des deals",
        "automatable": false,
        "score": 2,
        "explanation": "La négociation commerciale nécessite de l''empathie, de l''adaptation en temps réel et une compréhension fine des enjeux du client. C''est un travail humain par excellence.",
        "agent_slug": null
      },
      {
        "name": "Participation aux salons et événements",
        "automatable": false,
        "score": 1,
        "explanation": "La présence physique sur des événements, le networking en face-à-face et la représentation de l''entreprise ne sont pas automatisables.",
        "agent_slug": null
      }
    ],
    "summary": "5 tâches sur 7 automatisables — 71%"
  },
  "solution_section": {
    "section_title": "La solution qu''on propose",
    "intro": "Pour TechSolutions, notre agent Prospecteur Outbound couvre l''essentiel des tâches répétitives de votre futur SDR.",
    "primary_agent": {
      "name": "Prospecteur Outbound",
      "description": "Un agent IA qui gère l''intégralité de votre prospection sortante : de la constitution de listes au suivi CRM, en passant par les séquences email personnalisées. Il traite 500+ leads par jour avec une personnalisation que même un SDR senior ne peut pas maintenir à cette échelle.",
      "key_capabilities": [
        "Scraping et enrichissement de 500+ leads qualifiés par jour",
        "Séquences email multicanal avec personnalisation IA",
        "Scoring et qualification automatique des leads",
        "Reporting d''activité en temps réel dans votre CRM"
      ],
      "setup_time": "Opérationnel en 1 à 2 semaines",
      "integration_note": "S''intègre nativement avec HubSpot, Pipedrive et Salesforce"
    },
    "secondary_agent": null
  },
  "roi_section": {
    "section_title": "Le calcul est simple",
    "comparison": {
      "recruitment_label": "Recrutement classique",
      "recruitment_annual_cost": 50750,
      "recruitment_details": "Salaire brut 35K€ + charges patronales 45% + onboarding 3 mois + formation + turnover",
      "agent_label": "Agent IA Gralt",
      "agent_monthly_cost": "800",
      "agent_annual_cost": 9600,
      "agent_details": "Opérationnel en 2 semaines, 0 charges sociales, scalable"
    },
    "saving": {
      "annual_amount": 41150,
      "percentage": "81%",
      "display_text": "Économie : 41 150€/an"
    },
    "bonus_arguments": [
      "Opérationnel en 2 semaines, pas 3 mois",
      "Disponible 24/7, 365 jours par an",
      "Scalable sans surcoût proportionnel"
    ],
    "price_display": "À partir de 800€/mois, selon la complexité de votre environnement."
  },
  "credibility_section": {
    "section_title": "On ne parle pas en théorie",
    "case_study": {
      "text": "Une PME SaaS B2B de 30 personnes à Lyon a déployé notre agent Prospecteur Outbound pour remplacer un poste de SDR vacant depuis 4 mois. En 1 mois, l''agent a généré 3x plus de leads qualifiés que le SDR précédent, avec un taux de réponse de 12% contre 4% auparavant.",
      "metric_highlight": "3x plus de leads qualifiés"
    },
    "trust_points": [
      "Spécialiste de l''automatisation IA depuis 2022",
      "Basés à Lille, on travaille exclusivement avec des PME françaises",
      "Stack éprouvée : n8n, Claude AI, intégrations CRM natives",
      "Agents déjà en production chez plusieurs clients"
    ]
  },
  "cta_section": {
    "title": "15 minutes pour voir ce que ça donne chez vous ?",
    "subtitle": "Sans engagement. On vous montre concrètement ce que l''agent ferait avec votre CRM et vos process.",
    "calendly_url": "{{CALENDLY_URL}}",
    "email_fallback": "raph@gralt.fr",
    "email_fallback_text": "Vous préférez échanger par email ?"
  }
}'::jsonb),

-- Page 2: LogiPro France — Assistant ADV
('c1000000-0000-0000-0000-000000000002', 'logipro-assistant-adv-mars-2026', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', true, '{
  "meta": {
    "title": "LogiPro France — Audit IA de votre poste d''Assistant ADV | Gralt",
    "description": "6 des 7 tâches de votre poste d''Assistant ADV sont automatisables par un agent IA. Découvrez l''audit personnalisé."
  },
  "hero": {
    "title": "LogiPro, on a analysé votre offre d''Assistant ADV.",
    "subtitle": "6 des 7 tâches de ce poste sont automatisables par un agent IA."
  },
  "audit_section": {
    "section_title": "Audit de votre offre",
    "intro": "Nous avons analysé chaque tâche de votre offre d''Assistant Administration des Ventes pour mesurer le potentiel d''automatisation.",
    "tasks": [
      {
        "name": "Création et envoi de devis",
        "automatable": true,
        "score": 10,
        "explanation": "La génération de devis depuis des templates avec remplissage automatique des données client, produits et tarifs est 100% automatisable. L''agent gère aussi les relances de devis sans réponse.",
        "agent_slug": "gestionnaire_adv"
      },
      {
        "name": "Suivi des commandes",
        "automatable": true,
        "score": 9,
        "explanation": "Le tracking des commandes, les mises à jour de statut et les notifications clients sont entièrement automatisés. Chaque commande est suivie en temps réel dans votre ERP.",
        "agent_slug": "gestionnaire_adv"
      },
      {
        "name": "Mise à jour CRM et ERP",
        "automatable": true,
        "score": 10,
        "explanation": "La synchronisation des données entre vos outils (statuts, contacts, historique) est le terrain de prédilection de l''agent. Zéro double saisie, zéro erreur.",
        "agent_slug": "gestionnaire_adv"
      },
      {
        "name": "Facturation et transformation devis-commande",
        "automatable": true,
        "score": 9,
        "explanation": "La chaîne devis → bon de commande → facture est automatisée de bout en bout. L''agent détecte les validations et déclenche chaque étape.",
        "agent_slug": "gestionnaire_adv"
      },
      {
        "name": "Reporting commercial mensuel",
        "automatable": true,
        "score": 9,
        "explanation": "Les rapports de ventes, marges, délais de livraison et indicateurs clés sont compilés et mis en forme automatiquement chaque semaine.",
        "agent_slug": "gestionnaire_adv"
      },
      {
        "name": "Gestion des réclamations simples",
        "automatable": true,
        "score": 7,
        "explanation": "Les réclamations de niveau 1 (retard, erreur de livraison, demande d''avoir) sont traitées automatiquement. Les cas complexes sont escaladés vers l''équipe.",
        "agent_slug": "gestionnaire_adv"
      },
      {
        "name": "Relation client stratégique et négociation",
        "automatable": false,
        "score": 2,
        "explanation": "La gestion des comptes clés, la négociation de contrats-cadres et la résolution de litiges complexes nécessitent un interlocuteur humain de confiance.",
        "agent_slug": null
      }
    ],
    "summary": "6 tâches sur 7 automatisables — 86%"
  },
  "solution_section": {
    "section_title": "La solution qu''on propose",
    "intro": "Pour LogiPro, notre agent Gestionnaire ADV prend en charge la quasi-totalité des tâches administratives de vente.",
    "primary_agent": {
      "name": "Gestionnaire ADV",
      "description": "Un agent IA qui automatise l''intégralité de votre chaîne administrative de vente : devis, commandes, facturation, suivi et reporting. Il élimine les erreurs de saisie et réduit votre cycle order-to-cash de 40%.",
      "key_capabilities": [
        "Génération automatique de devis depuis vos templates",
        "Transformation devis → commande → facture sans intervention",
        "Suivi des commandes en temps réel avec alertes",
        "Reporting commercial automatique et personnalisé"
      ],
      "setup_time": "Opérationnel en 2 à 3 semaines",
      "integration_note": "S''intègre avec Pennylane, Sellsy et les principaux ERP du marché"
    },
    "secondary_agent": null
  },
  "roi_section": {
    "section_title": "Le calcul est simple",
    "comparison": {
      "recruitment_label": "Recrutement classique",
      "recruitment_annual_cost": 46400,
      "recruitment_details": "Salaire brut 32K€ + charges patronales 45% + onboarding + formation + turnover",
      "agent_label": "Agent IA Gralt",
      "agent_monthly_cost": "900",
      "agent_annual_cost": 10800,
      "agent_details": "Opérationnel en 3 semaines, 0 charges sociales, scalable"
    },
    "saving": {
      "annual_amount": 35600,
      "percentage": "77%",
      "display_text": "Économie : 35 600€/an"
    },
    "bonus_arguments": [
      "Opérationnel en 3 semaines, pas 3 mois",
      "Traite 10 ou 1000 commandes avec la même efficacité",
      "Zéro erreur de saisie, traçabilité complète"
    ],
    "price_display": "À partir de 900€/mois, selon la complexité de votre environnement."
  },
  "credibility_section": {
    "section_title": "Des résultats, pas des promesses",
    "case_study": {
      "text": "Une entreprise de distribution B2B de 80 personnes a déployé notre agent Gestionnaire ADV pour automatiser son flux devis-commande-facture. Le cycle de facturation est passé de 5 jours à 24h, avec une réduction de 95% des erreurs de saisie.",
      "metric_highlight": "Cycle de facturation : 5 jours → 24h"
    },
    "trust_points": [
      "Spécialiste de l''automatisation IA depuis 2022",
      "Basés à Lille, on travaille exclusivement avec des PME françaises",
      "Stack éprouvée : n8n, Claude AI, intégrations ERP natives",
      "Agents déjà en production chez plusieurs clients"
    ]
  },
  "cta_section": {
    "title": "On vous montre en 15 minutes ?",
    "subtitle": "Sans engagement. On simule le traitement d''une commande type de votre entreprise.",
    "calendly_url": "{{CALENDLY_URL}}",
    "email_fallback": "raph@gralt.fr",
    "email_fallback_text": "Vous préférez échanger par email ?"
  }
}'::jsonb),

-- Page 3: ConseilPlus — Chargé de clientèle (cas limite)
('c1000000-0000-0000-0000-000000000003', 'conseilplus-charge-clientele-mars-2026', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', true, '{
  "meta": {
    "title": "ConseilPlus — Audit IA de votre poste de Chargé de clientèle | Gralt",
    "description": "3 des 6 tâches de votre poste de Chargé de clientèle sont automatisables. Découvrez notre analyse personnalisée."
  },
  "hero": {
    "title": "ConseilPlus, on a analysé votre offre de Chargé de clientèle.",
    "subtitle": "3 des 6 tâches de ce poste sont automatisables par un agent IA."
  },
  "audit_section": {
    "section_title": "Audit de votre offre",
    "intro": "Nous avons passé en revue les tâches de votre offre de Chargé de clientèle. Le poste a un profil mixte : certaines tâches sont clairement automatisables, d''autres nécessitent l''humain.",
    "tasks": [
      {
        "name": "Qualification des demandes entrantes",
        "automatable": true,
        "score": 8,
        "explanation": "Le tri, la catégorisation et la qualification initiale des demandes clients (email, formulaire, chat) sont automatisables avec un scoring intelligent et un routing vers le bon interlocuteur.",
        "agent_slug": "qualificateur_inbound"
      },
      {
        "name": "Mise à jour CRM et suivi client",
        "automatable": true,
        "score": 9,
        "explanation": "La saisie des interactions, la mise à jour des fiches clients et le suivi des historiques sont entièrement automatisés. L''agent synchronise tout en temps réel.",
        "agent_slug": "qualificateur_inbound"
      },
      {
        "name": "Prise de rendez-vous et gestion d''agenda",
        "automatable": true,
        "score": 8,
        "explanation": "La planification de rendez-vous, les confirmations et les rappels sont gérés automatiquement. L''agent se synchronise avec votre agenda et celui du client.",
        "agent_slug": "qualificateur_inbound"
      },
      {
        "name": "Conseil et accompagnement client personnalisé",
        "automatable": false,
        "score": 3,
        "explanation": "Le conseil stratégique personnalisé, la compréhension des enjeux métier du client et l''accompagnement dans la durée nécessitent une expertise et une empathie humaines.",
        "agent_slug": null
      },
      {
        "name": "Gestion des réclamations complexes",
        "automatable": false,
        "score": 2,
        "explanation": "Les situations de crise, les litiges et les réclamations nécessitant de la négociation ou de la diplomatie ne peuvent pas être délégués à un agent.",
        "agent_slug": null
      },
      {
        "name": "Fidélisation et développement du portefeuille",
        "automatable": false,
        "score": 3,
        "explanation": "La construction de relations de confiance sur le long terme, l''identification d''opportunités de vente additionnelle et la rétention client sont des compétences profondément humaines.",
        "agent_slug": null
      }
    ],
    "summary": "3 tâches sur 6 automatisables — 50%"
  },
  "solution_section": {
    "section_title": "La solution qu''on propose",
    "intro": "Pour ConseilPlus, notre agent libère votre chargé de clientèle des tâches administratives pour qu''il se concentre sur le conseil et la relation client.",
    "primary_agent": {
      "name": "Qualificateur Inbound",
      "description": "Un agent IA qui prend en charge la qualification des demandes entrantes, le suivi CRM et la gestion d''agenda. Votre chargé de clientèle se concentre sur ce qu''il fait de mieux : conseiller et accompagner vos clients.",
      "key_capabilities": [
        "Réponse automatique aux demandes en moins de 2 minutes",
        "Qualification et scoring des demandes entrantes",
        "Synchronisation CRM et historique client en temps réel",
        "Prise de rendez-vous et gestion d''agenda automatisée"
      ],
      "setup_time": "Opérationnel en 1 à 2 semaines",
      "integration_note": "S''intègre avec les principaux CRM et outils d''agenda du marché"
    },
    "secondary_agent": null
  },
  "roi_section": {
    "section_title": "Le calcul est simple",
    "comparison": {
      "recruitment_label": "Recrutement classique",
      "recruitment_annual_cost": 55100,
      "recruitment_details": "Salaire brut 38K€ + charges patronales 45% + onboarding + formation continue",
      "agent_label": "Agent IA Gralt (en complément)",
      "agent_monthly_cost": "700",
      "agent_annual_cost": 8400,
      "agent_details": "En support de votre équipe, pas en remplacement"
    },
    "saving": {
      "annual_amount": 8400,
      "percentage": "N/A",
      "display_text": "Votre chargé de clientèle récupère 15h par semaine"
    },
    "bonus_arguments": [
      "Opérationnel en 2 semaines",
      "Temps de réponse client divisé par 20",
      "Votre équipe se concentre sur le conseil à forte valeur ajoutée"
    ],
    "price_display": "À partir de 700€/mois, selon la complexité de votre environnement."
  },
  "credibility_section": {
    "section_title": "Ce n''est pas de la théorie",
    "case_study": {
      "text": "Un cabinet de conseil B2B de 45 personnes a déployé notre agent Qualificateur Inbound en support de son équipe client. Le temps de réponse moyen est passé de 6 heures à 90 secondes, et le taux de conversion des leads entrants a augmenté de 18% à 34%.",
      "metric_highlight": "Taux de conversion : 18% → 34%"
    },
    "trust_points": [
      "Spécialiste de l''automatisation IA depuis 2022",
      "Basés à Lille, on travaille exclusivement avec des PME françaises",
      "Stack éprouvée : n8n, Claude AI, intégrations CRM natives",
      "Agents déjà en production chez plusieurs clients"
    ]
  },
  "cta_section": {
    "title": "Curieux de voir ce que ça donne chez vous ?",
    "subtitle": "15 minutes, sans engagement. On vous montre comment l''agent s''intègre dans votre process actuel.",
    "calendly_url": "{{CALENDLY_URL}}",
    "email_fallback": "raph@gralt.fr",
    "email_fallback_text": "Vous préférez échanger par email ?"
  }
}'::jsonb);
