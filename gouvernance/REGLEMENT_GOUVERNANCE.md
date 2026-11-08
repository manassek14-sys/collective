# Règlement de gouvernance informatique — COLLECTIVE

Version 1.0

## 1. Objet

Le présent règlement définit l’organisation, les responsabilités et les règles de décision relatives à la gouvernance informatique du projet COLLECTIVE (application de gestion et d’investissement collectif).

## 2. Acteurs

### 2.1 Administrateur général / propriétaire
- Détient la décision finale sur les évolutions majeures, les droits d’accès sensibles et les suppressions définitives.
- Valide les déploiements en production et les modifications des règles financières.
- Peut déléguer des tâches opérationnelles mais conserve le pouvoir de validation.

### 2.2 Technicien principal
- Assure la maintenance courante, les corrections d’anomalies et la préparation des évolutions.
- Gère le dépôt, les branches et les tests techniques dans le respect de la matrice des permissions.
- Propose les évolutions et rend compte à l’administrateur général.

### 2.3 Technicien adjoint
- Seconde le technicien principal.
- Effectue les tests, la documentation opérationnelle et assure la continuité en cas d’absence.
- N’effectue pas de modifications financières ni de suppressions définitives sans autorisation.

## 3. Principes

1. **Traçabilité** : toute intervention significative est journalisée.
2. **Moindre privilège** : les droits d’accès sont limités au strict nécessaire.
3. **Validation** : les changements critiques requièrent l’accord explicite de l’administrateur général.
4. **Sauvegarde** : des exports réguliers des données sont recommandés.
5. **Séparation** : le prototype front-end actuel ne constitue pas un système de production certifié ; les règles de gouvernance s’appliquent aussi aux évolutions futures (backend, authentification, etc.).

## 4. Modifications

Les demandes de modification suivent le modèle `modeles/DEMANDE_MODIFICATION.md`. Les modifications financières, de droits ou de suppression définitive sont soumises à validation préalable.

## 5. Sécurité et données

- Les données de démonstration et de production (quand applicable) ne doivent pas contenir d’informations sensibles non nécessaires.
- Les accès au dépôt et à l’hébergement sont gérés selon la matrice des permissions.
- En cas d’incident, le technicien principal informe immédiatement l’administrateur général.

## 6. Entrée en vigueur

Ce règlement entre en vigueur après approbation par l’administrateur général. Il peut être révisé par avenant.

## 7. Références

- Matrice des permissions
- Procédure de maintenance
- Modèles de demande et de journal
