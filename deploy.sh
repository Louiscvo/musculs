#!/bin/bash

echo "🚀 Déploiement automatique de votre application Programme Musculation"
echo "=================================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si on est dans le bon répertoire
cd "/Users/louischavouet/Documents/projet muscul"

echo -e "${BLUE}📝 Étape 1/3 : Vérification du repository local${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓ Repository git trouvé${NC}"
else
    echo -e "${RED}✗ Pas de repository git trouvé${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📝 Étape 2/3 : Push du code vers GitHub${NC}"
echo ""
echo "Pour pousser le code, j'ai besoin de vos identifiants GitHub :"
echo ""
echo "1. Username GitHub : Louiscvo"
echo "2. Token d'accès : (créez-en un sur : https://github.com/settings/tokens/new)"
echo ""
echo -e "${BLUE}Si vous n'avez pas encore créé de token :${NC}"
echo "   - Une page devrait être ouverte dans votre navigateur"
echo "   - Sinon, allez sur : https://github.com/settings/tokens/new"
echo "   - Cochez 'repo'"
echo "   - Cliquez sur 'Generate token'"
echo "   - Copiez le token (commence par ghp_)"
echo ""

read -p "Avez-vous votre token GitHub ? (oui/non) : " has_token

if [ "$has_token" != "oui" ] && [ "$has_token" != "o" ]; then
    echo ""
    echo -e "${BLUE}Pas de problème ! Créez d'abord votre token :${NC}"
    echo "1. Allez sur : https://github.com/settings/tokens/new"
    echo "2. Cochez 'repo'"
    echo "3. Cliquez 'Generate token'"
    echo "4. Copiez le token"
    echo "5. Relancez ce script : ./deploy.sh"
    echo ""
    open "https://github.com/settings/tokens/new?description=Programme%20Musculation&scopes=repo"
    exit 0
fi

echo ""
read -sp "Collez votre token GitHub : " token
echo ""

# Construire l'URL avec le token
remote_url="https://Louiscvo:${token}@github.com/Louiscvo/programme-musculation.git"

# Configurer le remote avec le token
git remote set-url origin "$remote_url"

# Pousser le code
echo ""
echo -e "${BLUE}Pushing code to GitHub...${NC}"
if git push -u origin main; then
    echo -e "${GREEN}✓ Code poussé avec succès !${NC}"

    # Nettoyer le token de l'URL pour la sécurité
    git remote set-url origin "https://github.com/Louiscvo/programme-musculation.git"

    echo ""
    echo -e "${BLUE}📝 Étape 3/3 : Activation de GitHub Pages${NC}"
    echo ""
    echo "Maintenant, activons GitHub Pages :"
    echo "1. Allez sur : https://github.com/Louiscvo/programme-musculation/settings/pages"
    echo "2. Sous 'Source', sélectionnez 'main' branch"
    echo "3. Cliquez sur 'Save'"
    echo ""

    read -p "Ouvrir la page des paramètres GitHub Pages ? (oui/non) : " open_pages

    if [ "$open_pages" == "oui" ] || [ "$open_pages" == "o" ]; then
        open "https://github.com/Louiscvo/programme-musculation/settings/pages"
    fi

    echo ""
    echo -e "${GREEN}=================================================================="
    echo -e "🎉 Félicitations ! Votre application va bientôt être en ligne !${NC}"
    echo ""
    echo "📱 Votre site sera disponible dans 2-3 minutes à :"
    echo -e "${BLUE}https://louiscvo.github.io/programme-musculation/${NC}"
    echo ""
    echo "💡 Ajoutez cette URL à vos favoris ou sur l'écran d'accueil de votre téléphone !"
    echo -e "=================================================================="

else
    echo -e "${RED}✗ Erreur lors du push${NC}"
    echo "Vérifiez que :"
    echo "- Le dépôt existe sur GitHub"
    echo "- Le token est valide et a les bonnes permissions (repo)"
    exit 1
fi
