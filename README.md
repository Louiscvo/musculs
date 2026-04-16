# Programme Musculation

Application web pour suivre son programme de musculation, hébergée sur GitHub Pages.

## Fonctionnalités

- Affichage du programme par jour de la semaine
- Timer de repos intégré (3 minutes)
- Design responsive (mobile et desktop)
- Sauvegarde locale de la progression

## Installation

L'application est hébergée sur GitHub Pages. Pour l'utiliser localement :

```bash
git clone https://github.com/Louiscvo/musculs.git
cd musculs
# Ouvrir index.html dans un navigateur
```

## Personnalisation

Modifier `data.js` pour changer le programme :

```javascript
const workoutProgram = {
    lundi: {
        name: "Lundi",
        categories: [
            {
                name: "Groupe musculaire",
                exercises: [
                    { name: "Exercice", details: "4 x 15 reps" }
                ]
            }
        ]
    }
};
```

## Utilisation

1. Ouvrir l'application
2. Sélectionner le jour
3. Utiliser le timer pour les temps de repos

## Licence

Libre d'utilisation pour usage personnel.
