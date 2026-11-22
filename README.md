# Cortex

Tableau de bord personnel, pensé pour le téléphone, qui transforme mes bases **Notion** en statistiques et en outils de revue.

## Fonctionnalités

- **Habitudes** : heatmap annuelle, séries en cours, records, taux de réussite.
- **Évolution** : note journalière, détail de la semaine.
- **Objectifs** : suivi par jour, semaine et mois.
- **Projets** : progression, tâches en retard, prochaines échéances.
- **Revue** (méthode PARA) :
  - inventaire des tâches, projets, ressources et areas : tri, classement par catégorie, archivage ;
  - revues hebdomadaire et mensuelle sous forme de checklist, avec compteurs en direct ;
  - nettoyage des tâches non accomplies (reporter, terminer, archiver en lot) ;
  - conversion d'un projet en tâche.

## Stack

| Partie   | Technologies                                   |
| -------- | ---------------------------------------------- |
| Frontend | Angular 22, Tailwind CSS 4, Chart.js           |
| Backend  | Node.js, Express 5, SDK Notion (`@notionhq/client`) |

Le backend lit et écrit dans Notion avec un cache mémoire, et sert aussi le frontend compilé.

## Installation

```bash
# 1. Dépendances
cd backend && npm install
cd ../frontend && npm install

# 2. Configuration : créer backend/.env
NOTION_TOKEN=secret_xxx
PORT=3000
NOTION_DS_TASK=...        # ID de chaque base Notion utilisée
NOTION_DS_PROJECTS=...
NOTION_DS_RESOURCES=...
NOTION_DS_AREAS=...
NOTION_DS_HABITS=...
NOTION_DS_SUIVI=...
NOTION_DS_OBJECTIFS_JOURNALIERS=...
NOTION_DS_OBJECTIFS_HEBDO=...
NOTION_DS_OBJECTIFS_MENSUELS=...
```

Les bases doivent être partagées avec l'intégration Notion. `GET /api/notion/bases` liste les IDs disponibles.

## Lancer

```bash
cd frontend && npx ng build     # compile le frontend
cd ../backend && node server.js # http://localhost:3000
```

En développement, lancer `npx ng serve` dans `frontend` (http://localhost:4200) en parallèle du backend.
Sous Windows, `cortex.bat` démarre et arrête le serveur.
