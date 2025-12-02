# 🎯 DERNIÈRE ÉTAPE - Plus qu'une commande !

## Vous y êtes presque ! Plus qu'une seule commande à lancer :

### 1️⃣ Créez votre token GitHub

Une page devrait être ouverte dans votre navigateur (https://github.com/settings/tokens/new)

- Si ce n'est pas le cas, allez sur : https://github.com/settings/tokens/new
- Faites défiler tout en bas
- Cliquez sur **"Generate token"** (bouton vert)
- **COPIEZ le token** qui apparaît (il commence par `ghp_...`)

### 2️⃣ Lancez le script de déploiement

Ouvrez un nouveau terminal (Cmd+T) et copiez-collez cette commande :

```bash
cd "/Users/louischavouet/Documents/projet muscul" && ./deploy.sh
```

Le script vous demandera votre token, collez-le et c'est terminé !

---

## ⚡ VERSION ULTRA-RAPIDE (Si vous avez votre token)

Si vous avez déjà copié votre token, lancez directement :

```bash
cd "/Users/louischavouet/Documents/projet muscul"
GITHUB_TOKEN="COLLEZ_VOTRE_TOKEN_ICI" git remote set-url origin "https://Louiscvo:${GITHUB_TOKEN}@github.com/Louiscvo/programme-musculation.git"
git push -u origin main
git remote set-url origin "https://github.com/Louiscvo/programme-musculation.git"
```

Puis activez GitHub Pages :
1. Allez sur https://github.com/Louiscvo/programme-musculation/settings/pages
2. Sous "Source", sélectionnez "main" branch
3. Cliquez "Save"

Votre site sera en ligne dans 2 minutes à :
**https://louiscvo.github.io/programme-musculation/**

---

## 🆘 Besoin d'aide ?

Si vous avez un problème, envoyez-moi un message avec l'erreur affichée.
