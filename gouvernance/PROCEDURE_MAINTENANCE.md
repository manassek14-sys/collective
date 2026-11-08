# Procédure de maintenance — COLLECTIVE

## Objectif

Assurer la continuité, la correction des anomalies et l’évolution contrôlée de l’application.

## Calendrier indicatif

| Type | Fréquence | Responsable |
|---|---|---|
| Vérification de fonctionnement | Hebdomadaire | Technicien adjoint |
| Sauvegarde des données (export JSON) | Hebdomadaire | Technicien principal |
| Revue des logs / anomalies | Mensuelle | Technicien principal |
| Mise à jour de dépendances / librairies | Trimestrielle | Technicien principal |
| Revue de sécurité | Semestrielle | Admin + Technicien principal |

## Processus de correction

1. Signalement (modèle DEMANDE_MODIFICATION ou message direct).
2. Analyse et classification (mineure / majeure / critique).
3. Correction sur branche dédiée si nécessaire.
4. Tests par le technicien adjoint.
5. Validation par l’administrateur général pour les changements sensibles.
6. Déploiement et mise à jour du journal d’interventions.

## Journal

Toute intervention significative doit être notée dans `modeles/JOURNAL_INTERVENTIONS.md` (ou un fichier équivalent tenu à jour).

## Continuité

En cas d’indisponibilité du technicien principal, le technicien adjoint assure les opérations courantes et escalade à l’administrateur général pour toute décision hors cadre.
