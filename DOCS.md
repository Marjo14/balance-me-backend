# 🧠 Spécifications Fonctionnelles & Logique Métier (BalanceMe)

Ce document détaille la traduction des besoins métier en règles de gestion techniques pour l'API BalanceMe.

## 1. Vision Métier : La "Conscience Financière"
L'objectif est de créer un **décalage temporel** entre l'impulsion d'achat et la dépense réelle. L'application agit comme un filtre cognitif.

| Concept | Traduction Métier |
| :--- | :--- |
| **L'Intention** | L'aveu d'une envie. On ne bloque pas l'utilisateur, on lui montre les conséquences. |
| **La Victoire** | Le renoncement volontaire. L'argent "économisé" devient une valeur positive (fierté). |
| **Le Réel** | La réalité bancaire. Ce qui est déjà parti. |

---

## 2. Logique de Calcul des Soldes (Le Cœur du Système)
C'est ici que se joue la valeur ajoutée du projet. Nous gérons trois compteurs distincts :

### A. Le Solde Réel (`realBalance`)
* **Définition** : L'argent disponible sur le compte bancaire.
* **Règle de gestion** : Il ne diminue **que** lorsque l'intention passe au statut `REALISEE`. Tant que c'est une intention, l'argent est physiquement toujours là.

### B. Le Solde Projeté (`projectedBalance`)
* **Définition** : La vision pessimiste du futur ("Qu'est-ce qu'il me reste si je craque pour tout ?").
* **Règle de gestion** : Il diminue **immédiatement** dès qu'une `INTENTION` est créée.
* **Impact** : Si l'utilisateur renonce (`AVORTEE`), ce solde remonte (récupération du pouvoir d'achat).

### C. Les Victoires Intérieures (`totalSaved`)
* **Définition** : Le cumul des renoncements.
* **Règle de gestion** : Il augmente du montant de l'intention uniquement lors du passage au statut `AVORTEE`.

---

## 3. Matrice de Transition des États
Pourquoi utiliser un `Enum` ? Pour garantir l'intégrité de cet algorithme :

| Action | Statut | Impact `realBalance` | Impact `projectedBalance` | Impact `totalSaved` |
| :--- | :--- | :--- | :--- | :--- |
| **Créer** | `INTENTION` | 0 (Stable) | - Montant | 0 |
| **Confirmer** | `REALISEE` | - Montant | 0 (Déjà déduit) | 0 |
| **Renoncer** | `AVORTEE` | 0 (Sauvé) | + Montant (Retour) | + Montant |

---

## 4. Choix Techniques Justifiés
* **UUID pour les IDs** : Sécurité accrue. On ne peut pas deviner l'ID d'une dépense en changeant juste un chiffre dans l'URL.
* **Prisma Enum** : Empêche l'injection de statuts fantaisistes qui casseraient les calculs de balance.
* **Table UserStats Unique** : Centralisation des compteurs pour éviter de recalculer des milliers de lignes de transactions à chaque appel du Dashboard (Optimisation des performances).