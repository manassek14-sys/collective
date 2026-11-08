# Matrice des permissions — COLLECTIVE

Document de référence des droits par profil.

## Profils

| Profil | Description |
|---|---|
| Administrateur général | Propriétaire, décision finale |
| Technicien principal | Maintenance, évolutions autorisées |
| Technicien adjoint | Support, tests, continuité |
| Membre (lecture) | Consultation limitée |

## Matrice

| Action | Admin général | Technicien principal | Technicien adjoint | Membre |
|---|---|---|---|---|
| Consulter le tableau de bord | Oui | Oui | Oui | Oui |
| Gérer les membres | Oui | Oui | Lecture | Non |
| Enregistrer cotisations | Oui | Oui | Oui | Non |
| Modifier cotisations existantes | Oui | Oui | Non | Non |
| Gérer les projets | Oui | Oui | Lecture | Non |
| Modifier la répartition financière | Oui | Avec accord | Non | Non |
| Exporter les données | Oui | Oui | Oui | Non |
| Restaurer une sauvegarde | Oui | Avec accord | Non | Non |
| Modifier les paramètres globaux | Oui | Avec accord | Non | Non |
| Accès au code / dépôt | Oui | Oui | Lecture | Non |
| Déployer en production | Oui | Avec accord | Non | Non |
| Supprimer des données définitives | Oui | Non | Non | Non |

## Règles

1. Toute action marquée « Avec accord » nécessite une validation écrite de l’administrateur général.
2. Les suppressions définitives et les changements de pourcentages de répartition sont réservés à l’administrateur général.
3. Les accès techniques (GitHub, hébergement) doivent refléter cette matrice.
