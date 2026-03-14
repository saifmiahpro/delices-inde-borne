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
