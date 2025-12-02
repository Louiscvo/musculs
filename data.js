// Programme de musculation
const workoutProgram = {
    lundi: {
        name: "Lundi",
        categories: [
            {
                name: "Cardio",
                exercises: [
                    { name: "Cardio au choix", details: "7 min" }
                ]
            },
            {
                name: "Quadriceps",
                exercises: [
                    { name: "Squats", details: "4 x 15 reps" },
                    { name: "Presse à cuisses", details: "4 x 15 reps" },
                    { name: "Leg extension", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Triceps",
                exercises: [
                    { name: "Dips", details: "4 x 15 reps" },
                    { name: "Extension poulie haute", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Abdos",
                exercises: [
                    { name: "Banc abdos", details: "4 x 15 reps" },
                    { name: "Gainage", details: "3 x 1 min" },
                    { name: "Russian twist", details: "4 x 15 reps" }
                ]
            }
        ],
        rest: "3 min de récupération entre les séries"
    },
    mardi: {
        name: "Mardi",
        categories: [
            {
                name: "Dos",
                exercises: [
                    { name: "Tirage verticale", details: "4 x 15 reps" },
                    { name: "Tirage horizontale", details: "4 x 15 reps" },
                    { name: "Banc lombaire", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Pecs",
                exercises: [
                    { name: "Développé incliné", details: "4 x 15 reps" },
                    { name: "Développé couché", details: "4 x 15 reps" },
                    { name: "Butterfly", details: "4 x 15 reps" }
                ]
            }
        ],
        rest: "3 min de récupération entre les séries"
    },
    mercredi: {
        name: "Mercredi",
        categories: [
            {
                name: "Repos",
                exercises: [
                    { name: "Jour de repos", details: "Récupération active recommandée" }
                ]
            }
        ]
    },
    jeudi: {
        name: "Jeudi",
        categories: [
            {
                name: "Pecs",
                exercises: [
                    { name: "Développé incliné", details: "4 x 15 reps" },
                    { name: "Développé couché", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Biceps",
                exercises: [
                    { name: "Curl biceps (barre)", details: "4 x 15 reps" },
                    { name: "Curl biceps (haltères)", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Quadriceps",
                exercises: [
                    { name: "Squats", details: "4 x 15 reps" },
                    { name: "Presse à cuisses", details: "4 x 15 reps" },
                    { name: "Leg extension", details: "4 x 15 reps" }
                ]
            }
        ],
        rest: "3 min de récupération entre les séries"
    },
    vendredi: {
        name: "Vendredi",
        categories: [
            {
                name: "Pecs",
                exercises: [
                    { name: "Développé incliné", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Triceps",
                exercises: [
                    { name: "Tirage poulie haute", details: "4 x 15 reps" },
                    { name: "Dips", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Ischio-Fessiers",
                exercises: [
                    { name: "Fentes", details: "4 x 15 reps" },
                    { name: "Poids bulgare", details: "4 x 15 reps" },
                    { name: "Banc ischio", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Abdos",
                exercises: [
                    { name: "Banc abdos", details: "4 x 15 reps" },
                    { name: "Gainage", details: "3 x 1 min" }
                ]
            }
        ],
        rest: "3 min de récupération entre les séries"
    },
    samedi: {
        name: "Samedi",
        categories: [
            {
                name: "Épaules",
                exercises: [
                    { name: "Élévation latérale", details: "4 x 15 reps" },
                    { name: "Élévation avant", details: "4 x 15 reps" },
                    { name: "Butterfly inversé", details: "4 x 15 reps" }
                ]
            },
            {
                name: "Dos",
                exercises: [
                    { name: "Tirage verticale", details: "4 x 15 reps" },
                    { name: "Tirage horizontale", details: "4 x 15 reps" }
                ]
            }
        ],
        rest: "3 min de récupération entre les séries"
    },
    dimanche: {
        name: "Dimanche",
        categories: [
            {
                name: "Repos",
                exercises: [
                    { name: "Jour de repos complet", details: "Récupération et étirements" }
                ]
            }
        ]
    },
    weekend: {
        name: "Weekend",
        categories: [
            {
                name: "Repos",
                exercises: [
                    { name: "Weekend de repos", details: "Récupération complète" },
                    { name: "Étirements légers", details: "10-15 minutes" },
                    { name: "Marche ou activité douce", details: "Optionnel" }
                ]
            }
        ]
    }
};
