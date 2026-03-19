# 🧘 BalanceMe - Backend API

**BalanceMe** est une application de gestion financière axée sur la **frugalité récompensée**. Contrairement aux applications de budget classiques, elle transforme chaque "non-achat" en une victoire intérieure et recalcule en temps réel l'impact de nos impulsions sur notre épargne.

## 🚀 Liens de Production
- **API Live (HTTPS) :** [https://balance-me-backend.onrender.com](https://balance-me-backend.onrender.com)
- **Documentation Interactive (Swagger) :** [https://balance-me-backend.onrender.com/api-docs/](https://balance-me-backend.onrender.com/api-docs/)

## 🏗️ Concept Métier : "La Récompense par le Renoncement"
Le cœur de l'application repose sur le cycle de vie d'une dépense :
* **INTENTION** : Une envie d'achat enregistrée. Le solde projeté diminue.
* **RÉALISÉE** : L'achat est fait, le solde réel diminue.
* **AVORTÉE** : Le désir est freiné. Le solde projeté remonte et une **Victoire Intérieure** est comptabilisée.

---

## 🛠️ Stack Technique & Infrastructure
* **Runtime** : Node.js (v22)
* **Framework** : Express.js
* **ORM** : Prisma (v6)
* **Base de données** : PostgreSQL (via **Supabase**)
* **Hébergement** : **Render** (Cloud Frankfurt)
* **CI/CD** : Déploiement automatique via GitHub

---

## ⚙️ Installation locale
1. `npm install`
2. `npx jest`
3. Configurer le fichier `.env` avec `DATABASE_URL` et `DIRECT_URL`.
4. `npx prisma generate`
5. `node index.js` (Serveur sur le port 8080)

---

## 📅 Journal de Bord (MVP)

### ✅ Jour 1 : Fondations & Infrastructure
* Modélisation de la base de données (Prisma/Supabase).
* Configuration de l'environnement Cloud & Clean-up Git (Migration Azure -> Render).
* Premier serveur Express opérationnel.

### ✅ Jour 2 : Logique Métier & Sécurité
* Développement de l'algorithme de calcul des soldes (Real vs Projected).
* Gestion des changements de statuts (Passage d'Intention à Victoire).
* Mise en place de la documentation API (Swagger/OpenAPI 3.0).

### ✅ Jour 3 : Finalisation & Déploiement
* Tests de connectivité Production -> Database.
* Déploiement continu (CD) activé sur la branche `main`.
* Soutenance technique.
