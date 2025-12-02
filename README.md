# 💪 Application Programme Musculation

Application web pour suivre votre programme de musculation, hébergée gratuitement sur GitHub Pages.

## 🚀 Fonctionnalités

- ✅ Affichage du programme par jour de la semaine
- ⏱️ Timer de repos intégré (3 minutes)
- 📱 Design responsive (mobile et desktop)
- 💾 Sauvegarde locale de la progression
- 🎨 Interface moderne et intuitive

## 📦 Déploiement sur GitHub Pages (GRATUIT)

### Étape 1 : Créer un dépôt GitHub

1. Allez sur [GitHub](https://github.com)
2. Cliquez sur "New repository"
3. Nommez votre dépôt : `programme-musculation` (ou tout autre nom)
4. Cochez "Public"
5. Cliquez sur "Create repository"

### Étape 2 : Pousser votre code sur GitHub

Dans votre terminal, exécutez les commandes suivantes :

```bash
# Initialiser le dépôt git (si ce n'est pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "Application programme musculation"

# Ajouter le dépôt distant (remplacez VOTRE-USERNAME et VOTRE-REPO)
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git

# Pousser le code
git push -u origin main
```

### Étape 3 : Activer GitHub Pages

1. Allez dans votre dépôt sur GitHub
2. Cliquez sur "Settings" (Paramètres)
3. Dans le menu de gauche, cliquez sur "Pages"
4. Sous "Source", sélectionnez la branche "main" et le dossier "/ (root)"
5. Cliquez sur "Save"
6. Attendez quelques minutes, votre site sera disponible à : `https://VOTRE-USERNAME.github.io/VOTRE-REPO/`

## 🌐 Configurer un Nom de Domaine Gratuit

### Option 1 : Utiliser un sous-domaine gratuit

**Services gratuits recommandés :**

1. **Freenom** (gratuit, .tk, .ml, .ga, .cf, .gq)
   - Site : https://www.freenom.com
   - Domaines gratuits pendant 12 mois (renouvelables)

2. **InfinityFree** (avec sous-domaine gratuit)
   - Site : https://infinityfree.net
   - Domaine gratuit inclus

### Option 2 : Configurer votre propre domaine

Si vous avez acheté un domaine (ex: sur Namecheap, GoDaddy, etc.) :

#### Configuration DNS :

1. Allez dans les paramètres DNS de votre fournisseur de domaine
2. Ajoutez les enregistrements suivants :

**Pour un domaine racine (exemple.com) :**
```
Type: A
Host: @
Value: 185.199.108.153

Type: A
Host: @
Value: 185.199.109.153

Type: A
Host: @
Value: 185.199.110.153

Type: A
Host: @
Value: 185.199.111.153
```

**Pour un sous-domaine (www.exemple.com ou musculation.exemple.com) :**
```
Type: CNAME
Host: www (ou musculation)
Value: VOTRE-USERNAME.github.io
```

#### Configuration GitHub Pages :

1. Retournez dans "Settings" > "Pages" de votre dépôt
2. Sous "Custom domain", entrez votre nom de domaine
3. Cochez "Enforce HTTPS" (attendez quelques minutes que le certificat soit généré)
4. Créez un fichier `CNAME` à la racine de votre projet avec votre nom de domaine :

```bash
echo "votre-domaine.com" > CNAME
git add CNAME
git commit -m "Ajouter nom de domaine personnalisé"
git push
```

## 🔧 Personnalisation

### Modifier le programme

Éditez le fichier `data.js` pour personnaliser votre programme :

```javascript
const workoutProgram = {
    lundi: {
        name: "Lundi",
        categories: [
            {
                name: "Nom du groupe musculaire",
                exercises: [
                    { name: "Nom de l'exercice", details: "4 x 15 reps" }
                ]
            }
        ],
        rest: "3 min de récupération entre les séries"
    }
    // ... autres jours
};
```

### Modifier le temps de repos

Dans `app.js`, ligne 3, changez la valeur (en secondes) :

```javascript
let timeRemaining = 180; // 3 minutes = 180 secondes
```

### Modifier les couleurs

Dans `styles.css`, modifiez les couleurs du gradient :

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📱 Utilisation

1. Ouvrez l'application dans votre navigateur
2. Le jour actuel est automatiquement sélectionné
3. Cliquez sur un jour pour voir le programme
4. Utilisez le timer pour chronométrer vos temps de repos
5. Cochez mentalement les exercices au fur et à mesure

## 🆓 Coût Total : 0€

- ✅ Hébergement GitHub Pages : GRATUIT
- ✅ HTTPS automatique : GRATUIT
- ✅ Disponibilité 24/7 : GRATUIT
- ✅ Domaine .github.io : GRATUIT
- ✅ (Optionnel) Domaine gratuit via Freenom : GRATUIT

## 📞 Support

Si vous avez des questions ou des problèmes, consultez :
- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [Guide des domaines personnalisés](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel.

---

**Bon entraînement ! 💪🏋️‍♂️**
