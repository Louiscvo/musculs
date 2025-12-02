// Variables globales
let currentDay = null;
let timerInterval = null;
let timeRemaining = 180; // 3 minutes en secondes

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDay();
    setupDayButtons();
    setupTimer();
    selectTodayAutomatically();
});

// Afficher le jour actuel
function displayCurrentDay() {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date();
    const dayName = days[today.getDay()];
    const currentDayElement = document.getElementById('currentDay');
    currentDayElement.textContent = `Aujourd'hui : ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
}

// Configurer les boutons de sélection de jour
function setupDayButtons() {
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedDay = button.getAttribute('data-day');
            selectDay(selectedDay);

            // Mettre à jour l'état actif des boutons
            dayButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// Sélectionner automatiquement le jour actuel
function selectTodayAutomatically() {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date();
    const dayName = days[today.getDay()];

    const todayButton = document.querySelector(`[data-day="${dayName}"]`);
    if (todayButton) {
        todayButton.click();
    }
}

// Sélectionner un jour et afficher le programme
function selectDay(day) {
    currentDay = day;
    const workout = workoutProgram[day];

    if (!workout) {
        displayNoWorkout();
        return;
    }

    displayWorkout(workout);
}

// Afficher le message "pas de programme"
function displayNoWorkout() {
    const workoutDisplay = document.getElementById('workoutDisplay');
    workoutDisplay.innerHTML = `
        <div class="no-workout">
            <p>Aucun programme pour ce jour</p>
        </div>
    `;
    document.getElementById('timerSection').style.display = 'none';
}

// Afficher le programme d'entraînement
function displayWorkout(workout) {
    const workoutDisplay = document.getElementById('workoutDisplay');

    let html = '';

    workout.categories.forEach(category => {
        html += `
            <div class="workout-category">
                <h2>${category.name}</h2>
                <ul class="exercise-list">
        `;

        category.exercises.forEach(exercise => {
            html += `
                <li class="exercise-item">
                    <div>
                        <div class="exercise-name">${exercise.name}</div>
                        <div class="exercise-details">${exercise.details}</div>
                    </div>
                </li>
            `;
        });

        html += `
                </ul>
            </div>
        `;
    });

    if (workout.rest) {
        html += `
            <div class="rest-info">
                <p>⏱️ ${workout.rest}</p>
            </div>
        `;
    }

    workoutDisplay.innerHTML = html;

    // Afficher le timer si ce n'est pas un jour de repos
    if (workout.rest) {
        document.getElementById('timerSection').style.display = 'block';
    } else {
        document.getElementById('timerSection').style.display = 'none';
    }
}

// Configuration du timer
function setupTimer() {
    const startButton = document.getElementById('startTimer');
    const resetButton = document.getElementById('resetTimer');

    startButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);
}

// Démarrer/Arrêter le timer
function toggleTimer() {
    const startButton = document.getElementById('startTimer');

    if (timerInterval) {
        // Arrêter le timer
        clearInterval(timerInterval);
        timerInterval = null;
        startButton.textContent = 'Reprendre';
    } else {
        // Démarrer le timer
        startButton.textContent = 'Pause';
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Mettre à jour le timer
function updateTimer() {
    if (timeRemaining > 0) {
        timeRemaining--;
        displayTime(timeRemaining);
    } else {
        // Timer terminé
        clearInterval(timerInterval);
        timerInterval = null;
        playSound();
        alert('Temps de repos terminé ! 💪');
        resetTimer();
    }
}

// Afficher le temps
function displayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
}

// Réinitialiser le timer
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = 180; // 3 minutes
    displayTime(timeRemaining);
    document.getElementById('startTimer').textContent = 'Démarrer';
}

// Jouer un son (notification)
function playSound() {
    // Créer un son simple avec l'API Audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Sauvegarder la progression dans le localStorage
function saveProgress(day, exerciseIndex) {
    const progress = JSON.parse(localStorage.getItem('workoutProgress') || '{}');
    const today = new Date().toISOString().split('T')[0];

    if (!progress[today]) {
        progress[today] = {};
    }

    if (!progress[today][day]) {
        progress[today][day] = [];
    }

    progress[today][day].push(exerciseIndex);
    localStorage.setItem('workoutProgress', JSON.stringify(progress));
}

// Charger la progression
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('workoutProgress') || '{}');
    const today = new Date().toISOString().split('T')[0];
    return progress[today] || {};
}
