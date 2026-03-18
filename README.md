# 🧘 BalanceMe - Backend API

**BalanceMe** est une application de gestion financière axée sur la **frugalité récompensée**. Contrairement aux applications de budget classiques, elle transforme chaque "non-achat" en une victoire intérieure et recalcule en temps réel l'impact de nos impulsions sur notre épargne.

## 🚀 Concept Métier : "La Récompense par le Renoncement"
Le cœur de l'application repose sur le cycle de vie d'une dépense :
* **INTENTION** : Une envie d'achat enregistrée.
* **RÉALISÉE** : L'achat est fait, le solde réel diminue.
* **AVORTÉE** : Le désir est freiné. Le solde projeté remonte et une **Victoire Intérieure** est comptabilisée.

---

## 🛠️ Stack Technique
* **Runtime** : Node.js
* **Framework** : Express.js
* **ORM** : Prisma (v6)
* **Base de données** : PostgreSQL (via Supabase)
* **Architecture** : REST API

---

## 📊 Modélisation des données

### Table `Intention`
| Champ | Type | Description |
| :--- | :--- | :--- |
| `label` | String | Nom de l'article/envie |
| `amount` | Float | Prix de l'article |
| `status` | Enum | `INTENTION`, `REALISEE`, `AVORTEE` |
| `emotion` | String | Sentiment associé à l'envie |

### Table `UserStats`
| Champ | Type | Description |
| :--- | :--- | :--- |
| `realBalance` | Float | Argent réellement disponible |
| `projectedBalance` | Float | Solde si toutes les intentions sont achetées |
| `totalSaved` | Float | Cumul des économies via les intentions avortées |

---

## 📅 Planning de développement (MVP - 3 Jours)

### Jour 1 : Fondations & Infrastructure
* ✅ Modélisation de la base de données (Prisma/Supabase).
* ✅ Configuration de l'environnement Cloud.
* ✅ Premier serveur Express opérationnel.
* 🚧 Création des routes de base (POST /intentions).

### Jour 2 : Logique Métier & Sécurité
* Développement de l'algorithme de calcul des soldes (Real vs Projected).
* Gestion des changements de statuts (Passage d'Intention à Victoire).
* Mise en place de la documentation API (Swagger/OpenAPI).

### Jour 3 : Finalisation & Déploiement
* Tests de performance et logs.
* Nettoyage du code et préparation de la soutenance.
* Déploiement final.

---

## ⚙️ Installation locale
1.  `npm install`
2.  Configurer le fichier `.env` avec `DATABASE_URL` et `DIRECT_URL`.
3.  `npx prisma db push`
4.  `node index.js`