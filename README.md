# Les Délices de l'Inde - Borne de Commande

Borne de commande tactile pour le restaurant Les Délices de l'Inde.

## Installation

1. Cloner le repo :
```bash
git clone https://github.com/VOTRE_USERNAME/delices-inde-borne.git
```

2. Lancer le démarrage automatique (optionnel) :
   - Double-cliquer sur `Installer_Demarrage_Auto.bat`
   - La borne démarrera automatiquement au prochain démarrage Windows

## Utilisation

### Lancer la borne
Double-cliquer sur `kiosk/Lancer_Borne_Serveur.bat`

### Menu Admin (5 clics sur le logo)
- **Historique commandes** : voir les dernières commandes
- **Imprimer ticket test** : tester l'impression
- **Mise à jour** : git pull + redémarrage
- **Fermer la borne** : quitter le mode kiosk

### Configuration imprimante
Mettre l'imprimante thermique comme **imprimante par défaut** Windows.
Les 2 tickets (cuisine + client) sortiront dessus séparément.

## Prérequis
- Windows 10/11
- Google Chrome
- Python 3.x OU Node.js (pour le serveur local)
- Imprimante thermique 80mm

## Mise à jour à distance
Le batch fait automatiquement `git pull` au démarrage.
Pour forcer une MAJ : Menu Admin → Mise à jour

## Refonte du 18/10/2026 — où est quoi

| Fichier | Rôle |
|---|---|
| `kiosk/index.html` | La page de la borne (ouverte par le lanceur, comme avant) |
| `kiosk/borne.js` / `kiosk/borne.css` | Nouvelle interface : carte, fiches produit, panier, prénom |
| `kiosk/products.js` | La carte (produits, prix, sauces, boissons) — c'est ici qu'on change un prix |
| `kiosk/tickets.js` | **Impression des tickets, historique, menu admin — NE PAS MODIFIER** (copie à l'identique de l'ancienne borne) |
| `kiosk/index_ancienne.html` | Ancienne borne, gardée en secours : si la nouvelle ne démarre pas, la borne y bascule toute seule |
| `kiosk/img/`, `kiosk/fonts/` | Photos allégées et polices (la borne marche même sans internet) |

Les lanceurs `.bat`, `serveur.ps1`, `maj.html` et `index_win7.html` n'ont pas été touchés :
la mise à jour se fait toujours par 5 clics sur le logo → MISE À JOUR.

Pour vérifier qu'une mise à jour est arrivée : 5 clics sur le logo, la version s'affiche en bas
du menu admin (« Version de la borne : … », constante `VERSION_BORNE` en haut de `kiosk/borne.js`,
à changer à chaque publication).

Le logo est touchable sur l'accueil, l'écran sur place / à emporter, la carte et l'écran prénom.
Si la nouvelle interface ne démarre pas correctement (fichier manquant, style non chargé,
menu admin absent), la borne bascule seule sur `kiosk/index_ancienne.html`, qui a son propre
menu admin et son bouton MISE À JOUR.
