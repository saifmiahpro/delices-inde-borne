#!/bin/bash
# Mise à jour Borne Chickenzz

cd "$(dirname "$0")/.."

echo ""
echo "========================================"
echo "   MISE A JOUR BORNE CHICKENZZ"
echo "========================================"
echo ""
echo "Téléchargement des dernières modifications..."
echo ""

git pull origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "   MISE A JOUR REUSSIE !"
    echo "========================================"
    echo ""
    echo "Les modifications ont été appliquées."
    echo "Relancez la borne pour voir les changements."
else
    echo ""
    echo "========================================"
    echo "   ERREUR DE MISE A JOUR"
    echo "========================================"
    echo ""
    echo "Vérifiez la connexion internet."
fi

echo ""
echo "Appuyez sur Entrée pour fermer..."
read
