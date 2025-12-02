# 🚀 Guide de Déploiement Rapide

## Étape par Étape pour mettre en ligne votre application

### 1️⃣ Créer un nouveau dépôt GitHub

1. Allez sur https://github.com/new
2. Nommez votre dépôt : `programme-musculation`
3. Cochez "Public"
4. Ne cochez PAS "Initialize this repository with a README"
5. Cliquez sur "Create repository"

### 2️⃣ Pousser votre code sur GitHub

Ouvrez un terminal dans le dossier de votre projet et exécutez :

```bash
# Supprimer l'ancien remote git (si nécessaire)
git remote remove origin

# Ajouter tous les fichiers de votre application web
git add index.html styles.css app.js data.js README.md .gitignore

# Créer un commit
git commit -m "Application web programme musculation"

# Ajouter votre nouveau dépôt GitHub
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/programme-musculation.git

# Pousser le code
git push -u origin main
```

### 3️⃣ Activer GitHub Pages

1. Allez sur votre dépôt : `https://github.com/VOTRE-USERNAME/programme-musculation`
2. Cliquez sur "⚙️ Settings"
3. Dans le menu de gauche, cliquez sur "Pages"
4. Sous "Source", sélectionnez :
   - Branch : `main`
   - Folder : `/ (root)`
5. Cliquez sur "Save"
6. ⏳ Attendez 2-3 minutes

### 4️⃣ Accéder à votre site

Votre site sera disponible à l'adresse :
```
https://VOTRE-USERNAME.github.io/programme-musculation/
```

---

## 🌐 Options de Nom de Domaine GRATUIT

### Option A : Domaine .github.io (GRATUIT)

C'est automatique ! Votre site est déjà accessible à :
```
https://VOTRE-USERNAME.github.io/programme-musculation/
```

### Option B : Nom de domaine gratuit avec Freenom

1. Allez sur https://www.freenom.com
2. Cherchez un nom de domaine disponible (ex: monprogramme.tk)
3. Cliquez sur "Get it now" puis "Checkout"
4. Créez un compte gratuit
5. Choisissez "12 Months @ FREE"
6. Finalisez la commande

**Configuration DNS sur Freenom :**

1. Allez dans "Services" > "My Domains"
2. Cliquez sur "Manage Domain"
3. Allez dans "Management Tools" > "Nameservers"
4. Sélectionnez "Use custom nameservers"
5. Ajoutez ces 4 adresses IP comme enregistrements A :
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

**Configuration GitHub :**

1. Dans votre dépôt, allez dans Settings > Pages
2. Sous "Custom domain", entrez : `monprogramme.tk`
3. Cochez "Enforce HTTPS"
4. Créez un fichier CNAME :
   ```bash
   echo "monprogramme.tk" > CNAME
   git add CNAME
   git commit -m "Ajouter domaine personnalisé"
   git push
   ```

### Option C : Cloudflare Pages (GRATUIT + Domaine personnalisé)

1. Créez un compte sur https://pages.cloudflare.com
2. Connectez votre compte GitHub
3. Sélectionnez votre dépôt `programme-musculation`
4. Déployez automatiquement
5. Vous obtiendrez un domaine `.pages.dev` gratuit

---

## 🎨 Personnalisation après déploiement

### Modifier votre programme

1. Éditez le fichier `data.js`
2. Committez et poussez :
   ```bash
   git add data.js
   git commit -m "Mise à jour du programme"
   git push
   ```
3. ⏳ Attendez 1-2 minutes, votre site sera mis à jour automatiquement

### Modifier les couleurs

1. Éditez `styles.css`
2. Committez et poussez comme ci-dessus

---

## 📱 Tester sur mobile

Une fois déployé, ouvrez l'URL sur votre téléphone pour tester :
- L'application est responsive
- Vous pouvez l'ajouter à l'écran d'accueil comme une app
- Le timer fonctionne même en arrière-plan

---

## ❓ Problèmes courants

### Le site ne s'affiche pas
- ⏳ Attendez 5 minutes après l'activation de GitHub Pages
- Vérifiez que vous avez bien sélectionné la branche `main`
- Vérifiez que `index.html` est à la racine du projet

### Le domaine personnalisé ne fonctionne pas
- ⏳ Les DNS peuvent prendre jusqu'à 24h à se propager
- Vérifiez que le fichier CNAME contient bien votre domaine
- Vérifiez les enregistrements DNS sur votre fournisseur

### Le site ne se met pas à jour
- Effacez le cache de votre navigateur (Ctrl+Shift+R)
- Vérifiez que le commit a bien été poussé sur GitHub

---

## 💡 Astuces

### Ajouter à l'écran d'accueil (iOS/Android)
1. Ouvrez le site dans Safari (iOS) ou Chrome (Android)
2. Cliquez sur "Partager" > "Ajouter à l'écran d'accueil"
3. L'app s'ouvrira comme une application native

### Mode hors ligne
Pour ajouter le support hors ligne, ajoutez un Service Worker (guide avancé).

---

**Besoin d'aide ?** Consultez la documentation GitHub Pages : https://docs.github.com/pages

**Bon déploiement ! 🚀**
