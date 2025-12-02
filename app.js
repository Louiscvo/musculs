// ============================================
// MUSCULS PRO - Application JavaScript
// Version 2.0 - Mode Professionnel
// ============================================

// État de l'application
const AppState = {
    currentDay: null,
    timerInterval: null,
    timeRemaining: 180,
    timerDuration: 180,
    theme: localStorage.getItem('theme') || 'light',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
    workoutData: JSON.parse(localStorage.getItem('workoutData')) || {},
    completedExercises: new Set(),
    stats: JSON.parse(localStorage.getItem('stats')) || {
        totalWorkouts: 0,
        currentStreak: 0,
        totalTime: 0,
        lastWorkoutDate: null,
        completedDays: {}
    }
};

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadTheme();
    displayCurrentDay();
    selectTodayAutomatically();
    updateStats();
    requestNotificationPermission();
});

function initializeApp() {
    console.log('🚀 Musculs Pro initialisé');
}

// ============================================
// GESTION DU THÈME
// ============================================
function loadTheme() {
    document.documentElement.setAttribute('data-theme', AppState.theme);
    updateThemeIcon();
}

function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', AppState.theme);
    document.documentElement.setAttribute('data-theme', AppState.theme);
    updateThemeIcon();
    showToast(`Mode ${AppState.theme === 'dark' ? 'sombre' : 'clair'} activé`);
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Thème
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Navigation des jours
    document.querySelectorAll('.day-btn').forEach(button => {
        button.addEventListener('click', () => {
            const day = button.getAttribute('data-day');
            selectDay(day);
            updateDayButtons();
        });
    });

    // Timer
    document.getElementById('startTimer')?.addEventListener('click', toggleTimer);
    document.getElementById('resetTimer')?.addEventListener('click', resetTimer);
    document.getElementById('skipTimer')?.addEventListener('click', skipTimer);

    // Presets timer
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const time = parseInt(e.target.getAttribute('data-time'));
            setTimerDuration(time);
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Notes
    document.getElementById('saveNotes')?.addEventListener('click', saveNotes);

    // Footer navigation
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            handleNavigation(view);
        });
    });

    // Modal closes
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Complete workout
    document.getElementById('completeWorkout')?.addEventListener('click', completeWorkout);

    // Settings
    document.getElementById('notificationsToggle')?.addEventListener('change', (e) => {
        AppState.notificationsEnabled = e.target.checked;
        localStorage.setItem('notificationsEnabled', e.target.checked);
    });

    document.getElementById('soundToggle')?.addEventListener('change', (e) => {
        AppState.soundEnabled = e.target.checked;
        localStorage.setItem('soundEnabled', e.target.checked);
    });

    document.getElementById('exportData')?.addEventListener('click', exportData);
    document.getElementById('resetData')?.addEventListener('click', resetData);
}

// ============================================
// AFFICHAGE DU JOUR ACTUEL
// ============================================
function displayCurrentDay() {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date();
    const dayName = days[today.getDay()];
    const formatted = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    const date = today.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const currentDayElement = document.getElementById('currentDay');
    if (currentDayElement) {
        currentDayElement.innerHTML = `📅 ${date.charAt(0).toUpperCase() + date.slice(1)}`;
    }
}

// ============================================
// SÉLECTION AUTOMATIQUE DU JOUR
// ============================================
function selectTodayAutomatically() {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date();
    let dayName = days[today.getDay()];

    // Si c'est samedi ou dimanche, afficher weekend
    if (dayName === 'samedi' || dayName === 'dimanche') {
        dayName = 'weekend';
    }

    const todayButton = document.querySelector(`[data-day="${dayName}"]`);
    if (todayButton) {
        todayButton.click();
    }
}

// ============================================
// SÉLECTION D'UN JOUR
// ============================================
function selectDay(day) {
    AppState.currentDay = day;
    const workout = workoutProgram[day];

    if (!workout) {
        displayNoWorkout();
        return;
    }

    displayWorkout(workout);
    loadNotes(day);
    updateDayButtons();
}

function updateDayButtons() {
    document.querySelectorAll('.day-btn').forEach(btn => {
        const day = btn.getAttribute('data-day');
        btn.classList.toggle('active', day === AppState.currentDay);

        // Badge de complétion
        const badge = btn.querySelector('.day-badge');
        const today = new Date().toISOString().split('T')[0];
        if (badge && AppState.stats.completedDays[today]?.includes(day)) {
            badge.classList.add('completed');
        } else if (badge) {
            badge.classList.remove('completed');
        }
    });
}

// ============================================
// AFFICHAGE DU PROGRAMME
// ============================================
function displayNoWorkout() {
    const workoutDisplay = document.getElementById('workoutDisplay');
    workoutDisplay.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">📋</span>
            <h3>Aucun programme</h3>
            <p>Aucun entraînement prévu pour ce jour</p>
        </div>
    `;
    document.getElementById('timerSection').style.display = 'none';
    document.getElementById('notesSection').style.display = 'none';
    document.getElementById('completeWorkout').style.display = 'none';
}

function displayWorkout(workout) {
    const workoutDisplay = document.getElementById('workoutDisplay');

    AppState.completedExercises.clear();

    let html = '';
    workout.categories.forEach((category, catIndex) => {
        html += `
            <div class="workout-category">
                <h2>${getCategoryIcon(category.name)} ${category.name}</h2>
                <ul class="exercise-list">
        `;

        category.exercises.forEach((exercise, exIndex) => {
            const exerciseId = `${catIndex}-${exIndex}`;
            html += `
                <li class="exercise-item" data-exercise="${exerciseId}" draggable="false">
                    <span class="drag-handle">⋮⋮</span>
                    <div style="flex: 1;">
                        <div class="exercise-name">${exercise.name}</div>
                    </div>
                    <div class="exercise-details">${exercise.details}</div>
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

    // Ajouter les event listeners pour marquer les exercices
    document.querySelectorAll('.exercise-item').forEach(item => {
        // Click sur l'exercice (sauf sur le handle)
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('drag-handle')) {
                toggleExercise(item);
            }
        });

        // Gestion du drag handle
        const dragHandle = item.querySelector('.drag-handle');
        if (dragHandle) {
            // Activer le drag seulement depuis le handle
            dragHandle.addEventListener('mousedown', () => {
                item.setAttribute('draggable', 'true');
            });

            dragHandle.addEventListener('touchstart', () => {
                item.setAttribute('draggable', 'true');
            });
        }

        // Drag & Drop
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', (e) => {
            handleDragEnd(e);
            item.setAttribute('draggable', 'false');
        });
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragleave', handleDragLeave);
    });

    // Afficher les sections
    if (workout.rest) {
        document.getElementById('timerSection').style.display = 'block';
    } else {
        document.getElementById('timerSection').style.display = 'none';
    }

    document.getElementById('notesSection').style.display = 'block';
    document.getElementById('completeWorkout').style.display = 'block';
}

function getCategoryIcon(name) {
    const icons = {
        'Cardio': '🏃',
        'Quadriceps': '🦵',
        'Triceps': '💪',
        'Abdos': '🎯',
        'Dos': '🏋️',
        'Pecs': '💪',
        'Biceps': '💪',
        'Épaules': '💪',
        'Ischio-Fessiers': '🦵',
        'Repos': '😴'
    };
    return icons[name] || '💪';
}

function toggleExercise(element) {
    element.classList.toggle('completed');
    const exerciseId = element.getAttribute('data-exercise');

    if (element.classList.contains('completed')) {
        AppState.completedExercises.add(exerciseId);
        playCompletionSound();
    } else {
        AppState.completedExercises.delete(exerciseId);
    }
}

// ============================================
// TIMER
// ============================================
function setTimerDuration(seconds) {
    AppState.timerDuration = seconds;
    AppState.timeRemaining = seconds;
    displayTime(seconds);
    updateTimerCircle(100);
}

function toggleTimer() {
    const startButton = document.getElementById('startTimer');
    const buttonText = document.getElementById('timerButtonText');

    if (AppState.timerInterval) {
        // Pause
        clearInterval(AppState.timerInterval);
        AppState.timerInterval = null;
        buttonText.textContent = 'Reprendre';
    } else {
        // Start
        buttonText.textContent = 'Pause';
        AppState.timerInterval = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    if (AppState.timeRemaining > 0) {
        AppState.timeRemaining--;
        displayTime(AppState.timeRemaining);

        const percentage = (AppState.timeRemaining / AppState.timerDuration) * 100;
        updateTimerCircle(percentage);
    } else {
        // Timer terminé
        clearInterval(AppState.timerInterval);
        AppState.timerInterval = null;
        playTimerCompleteSound();
        sendNotification('⏱️ Repos terminé !', 'C\'est reparti ! 💪');
        resetTimer();
        showToast('Temps de repos terminé ! 💪');
    }
}

function displayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = display;
    }
}

function updateTimerCircle(percentage) {
    const circle = document.getElementById('timerCircle');
    if (circle) {
        const circumference = 565.48;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

function resetTimer() {
    clearInterval(AppState.timerInterval);
    AppState.timerInterval = null;
    AppState.timeRemaining = AppState.timerDuration;
    displayTime(AppState.timeRemaining);
    updateTimerCircle(100);

    const buttonText = document.getElementById('timerButtonText');
    if (buttonText) buttonText.textContent = 'Démarrer';
}

function skipTimer() {
    clearInterval(AppState.timerInterval);
    AppState.timerInterval = null;
    AppState.timeRemaining = 0;
    displayTime(0);
    updateTimerCircle(0);

    const buttonText = document.getElementById('timerButtonText');
    if (buttonText) buttonText.textContent = 'Démarrer';

    showToast('Timer passé');
}

// ============================================
// NOTES
// ============================================
function loadNotes(day) {
    const today = new Date().toISOString().split('T')[0];
    const notes = AppState.workoutData[today]?.[day]?.notes || '';
    const textarea = document.getElementById('notesTextarea');
    if (textarea) {
        textarea.value = notes;
    }
}

function saveNotes() {
    const textarea = document.getElementById('notesTextarea');
    const notes = textarea?.value || '';
    const today = new Date().toISOString().split('T')[0];

    if (!AppState.workoutData[today]) {
        AppState.workoutData[today] = {};
    }
    if (!AppState.workoutData[today][AppState.currentDay]) {
        AppState.workoutData[today][AppState.currentDay] = {};
    }

    AppState.workoutData[today][AppState.currentDay].notes = notes;
    localStorage.setItem('workoutData', JSON.stringify(AppState.workoutData));

    // Afficher confirmation
    const saveIndicator = document.getElementById('notesSaved');
    if (saveIndicator) {
        saveIndicator.style.display = 'block';
        setTimeout(() => {
            saveIndicator.style.display = 'none';
        }, 2000);
    }

    showToast('✓ Notes sauvegardées');
}

// ============================================
// COMPLÉTION D'ENTRAÎNEMENT
// ============================================
function completeWorkout() {
    const today = new Date().toISOString().split('T')[0];

    // Sauvegarder la complétion
    if (!AppState.stats.completedDays[today]) {
        AppState.stats.completedDays[today] = [];
    }

    if (!AppState.stats.completedDays[today].includes(AppState.currentDay)) {
        AppState.stats.completedDays[today].push(AppState.currentDay);
        AppState.stats.totalWorkouts++;
        AppState.stats.totalTime += 60; // Estimation de 60 minutes par séance
        AppState.stats.lastWorkoutDate = today;

        // Calculer la série
        updateStreak();

        // Sauvegarder
        localStorage.setItem('stats', JSON.stringify(AppState.stats));

        // Notification
        sendNotification('🎉 Séance terminée !', 'Bravo ! Continue comme ça ! 💪');
        showToast('🎉 Séance validée ! Excellent travail ! 💪');

        // Confettis effect
        playCompletionSound();

        // Mettre à jour l'interface
        updateStats();
        updateDayButtons();
    } else {
        showToast('Séance déjà validée aujourd\'hui');
    }
}

function updateStreak() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (AppState.stats.completedDays[yesterdayStr] && AppState.stats.completedDays[yesterdayStr].length > 0) {
        AppState.stats.currentStreak++;
    } else if (!AppState.stats.completedDays[todayStr] || AppState.stats.completedDays[todayStr].length === 0) {
        AppState.stats.currentStreak = 1;
    }
}

// ============================================
// STATISTIQUES
// ============================================
function updateStats() {
    // Header stats
    document.getElementById('totalWorkouts').textContent = AppState.stats.totalWorkouts;
    document.getElementById('currentStreak').textContent = AppState.stats.currentStreak;

    // Modal stats
    document.getElementById('streakStat').textContent = AppState.stats.currentStreak;
    document.getElementById('totalWorkoutsStat').textContent = AppState.stats.totalWorkouts;
    document.getElementById('totalTimeStat').textContent = AppState.stats.totalTime;

    // This week
    const thisWeekCount = getThisWeekWorkouts();
    document.getElementById('thisWeekStat').textContent = thisWeekCount;
}

function getThisWeekWorkouts() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi

    let count = 0;
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        if (AppState.stats.completedDays[dateStr]) {
            count += AppState.stats.completedDays[dateStr].length;
        }
    }
    return count;
}

// ============================================
// NAVIGATION
// ============================================
function handleNavigation(view) {
    // Update active button
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Handle view
    switch(view) {
        case 'workout':
            // Already on workout view
            break;
        case 'stats':
            openModal('statsModal');
            generateCalendar();
            break;
        case 'settings':
            openModal('settingsModal');
            break;
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function generateCalendar() {
    const calendar = document.getElementById('progressCalendar');
    if (!calendar) return;

    const today = new Date();
    const last30Days = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        last30Days.push(date);
    }

    let html = '<div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px;">';

    last30Days.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        const hasWorkout = AppState.stats.completedDays[dateStr]?.length > 0;
        const color = hasWorkout ? 'var(--success)' : 'var(--border-color)';
        const title = `${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}${hasWorkout ? ' ✓' : ''}`;

        html += `<div style="width: 30px; height: 30px; background: ${color}; border-radius: 5px;" title="${title}"></div>`;
    });

    html += '</div>';
    html += '<p style="margin-top: 15px; text-align: center; color: var(--text-secondary); font-size: 0.9em;">Vos 30 derniers jours</p>';

    calendar.innerHTML = html;
}

// ============================================
// DONNÉES
// ============================================
function exportData() {
    const data = {
        stats: AppState.stats,
        workoutData: AppState.workoutData,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `musculs-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    showToast('✓ Données exportées');
}

function resetData() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
        localStorage.clear();
        location.reload();
    }
}

// ============================================
// NOTIFICATIONS
// ============================================
function requestNotificationPermission() {
    if ('Notification' in window && AppState.notificationsEnabled) {
        Notification.requestPermission();
    }
}

function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted' && AppState.notificationsEnabled) {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>'
        });
    }
}

// ============================================
// SONS
// ============================================
function playCompletionSound() {
    if (!AppState.soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playTimerCompleteSound() {
    if (!AppState.soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Jouer 3 bips
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }, i * 300);
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// UTILITAIRES
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Auto-save notes
document.getElementById('notesTextarea')?.addEventListener('input', debounce(() => {
    saveNotes();
}, 1000));

// ============================================
// DRAG & DROP
// ============================================
let draggedElement = null;

// Vibration mobile
function vibrate(duration = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Créer des confetti/emoji animés
function createConfetti(x, y) {
    const emojis = ['💪', '🔥', '⚡', '✨', '🎯', '💥', '🌟'];
    const numberOfConfetti = 6;

    for (let i = 0; i < numberOfConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';

        // Position aléatoire autour du point de drop
        const angle = (Math.PI * 2 * i) / numberOfConfetti;
        const distance = 50 + Math.random() * 50;
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        confetti.style.setProperty('--offset-x', offsetX + 'px');
        confetti.style.setProperty('--offset-y', offsetY + 'px');

        document.body.appendChild(confetti);

        // Retirer l'élément après l'animation
        setTimeout(() => confetti.remove(), 1000);
    }
}

function handleDragStart(e) {
    draggedElement = e.currentTarget;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);

    // Vibration de pickup
    vibrate(30);

    // Son de pickup (plus léger)
    if (AppState.soundEnabled) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');

    // Retirer tous les indicateurs de survol
    document.querySelectorAll('.exercise-item').forEach(item => {
        item.classList.remove('drag-over');
        item.classList.remove('drag-forbidden');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    const dropTarget = e.currentTarget;
    const draggedList = draggedElement?.parentNode;
    const dropList = dropTarget.parentNode;

    // Si c'est une catégorie différente, montrer que c'est interdit
    if (draggedList && draggedList !== dropList) {
        e.dataTransfer.dropEffect = 'none';
        dropTarget.classList.add('drag-forbidden');
        dropTarget.classList.remove('drag-over');
    } else {
        e.dataTransfer.dropEffect = 'move';
        dropTarget.classList.remove('drag-forbidden');
        dropTarget.classList.add('drag-over');
    }

    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    const dropTarget = e.currentTarget;

    if (draggedElement !== dropTarget) {
        // Vérifier que les deux éléments sont dans la même catégorie (même liste parente)
        const draggedList = draggedElement.parentNode;
        const dropList = dropTarget.parentNode;

        // Si les listes sont différentes, refuser le drop
        if (draggedList !== dropList) {
            // Feedback négatif
            dropTarget.classList.remove('drag-over');

            // Vibration d'erreur
            vibrate([100, 50, 100]);

            // Son d'erreur
            if (AppState.soundEnabled) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 200;
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
            }

            // Animation shake de refus
            dropTarget.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => {
                dropTarget.style.animation = '';
            }, 300);

            // Toast d'erreur
            showToast('❌ Impossible ! Même catégorie seulement');

            return false;
        }

        // Récupérer le parent (la liste)
        const list = dropTarget.parentNode;

        // Insérer l'élément déplacé avant l'élément cible
        if (draggedElement.compareDocumentPosition(dropTarget) & Node.DOCUMENT_POSITION_FOLLOWING) {
            list.insertBefore(draggedElement, dropTarget);
        } else {
            list.insertBefore(draggedElement, dropTarget.nextSibling);
        }

        // Effets de drop réussi
        // 1. Vibration double
        vibrate([50, 30, 50]);

        // 2. Animation bounce
        draggedElement.classList.add('just-dropped');
        setTimeout(() => draggedElement.classList.remove('just-dropped'), 500);

        // 3. Confetti autour de l'élément droppé
        const rect = draggedElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createConfetti(centerX, centerY);

        // 4. Son de drop (plus fort et satisfaisant)
        if (AppState.soundEnabled) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 600;
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }

        // 5. Toast avec emoji
        showToast('🎯 Ordre modifié !');
    }

    dropTarget.classList.remove('drag-over');
    dropTarget.classList.remove('drag-forbidden');
    return false;
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
    e.currentTarget.classList.remove('drag-forbidden');
}

// ============================================
// NOUVELLES FONCTIONNALITÉS V3.0
// ============================================

// État pour les nouvelles fonctionnalités
const V3State = {
    weights: JSON.parse(localStorage.getItem('weights')) || {},
    photos: JSON.parse(localStorage.getItem('photos')) || [],
    achievements: JSON.parse(localStorage.getItem('achievements')) || {}
};

// Liste des achievements
const ACHIEVEMENTS = [
    { id: 'first_workout', name: 'Première séance', icon: '🎯', description: 'Compléter votre première séance', check: () => AppState.stats.totalWorkouts >= 1 },
    { id: 'week_warrior', name: 'Guerrier hebdo', icon: '💪', description: '5 séances en une semaine', check: () => AppState.stats.thisWeekStat >= 5 },
    { id: 'streak_3', name: 'Régulier', icon: '🔥', description: '3 jours consécutifs', check: () => AppState.stats.currentStreak >= 3 },
    { id: 'streak_7', name: 'Déterminé', icon: '⚡', description: '7 jours consécutifs', check: () => AppState.stats.currentStreak >= 7 },
    { id: 'streak_30', name: 'Légendaire', icon: '👑', description: '30 jours consécutifs', check: () => AppState.stats.currentStreak >= 30 },
    { id: 'workout_10', name: 'Motivé', icon: '🎖️', description: '10 séances totales', check: () => AppState.stats.totalWorkouts >= 10 },
    { id: 'workout_50', name: 'Athlète', icon: '🏋️', description: '50 séances totales', check: () => AppState.stats.totalWorkouts >= 50 },
    { id: 'workout_100', name: 'Champion', icon: '🏆', description: '100 séances totales', check: () => AppState.stats.totalWorkouts >= 100 },
    { id: 'weight_record', name: 'Premier record', icon: '📈', description: 'Enregistrer un poids', check: () => Object.keys(V3State.weights).length > 0 },
    { id: 'progress_photo', name: 'Transformation', icon: '📸', description: 'Ajouter une photo', check: () => V3State.photos.length > 0 },
    { id: 'early_bird', name: 'Lève-tôt', icon: '🌅', description: 'Séance avant 8h', check: () => false }, // À implémenter
    { id: 'night_owl', name: 'Noctambule', icon: '🌙', description: 'Séance après 22h', check: () => false }, // À implémenter
    { id: 'all_exercises', name: 'Complet', icon: '✨', description: 'Tous les exercices complétés', check: () => false }, // À implémenter
    { id: 'heavy_lifter', name: 'Force pure', icon: '💥', description: '100kg+ sur un exercice', check: () => {
        return Object.values(V3State.weights).some(records =>
            records.some(r => r.weight >= 100)
        );
    }},
    { id: 'dedicated', name: 'Dévoué', icon: '🎓', description: '6 mois d\'entraînement', check: () => AppState.stats.totalWorkouts >= 80 }
];

// ============================================
// NAVIGATION FOOTER
// ============================================
document.querySelectorAll('.footer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');

        // Update active button
        document.querySelectorAll('.footer-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show corresponding modal
        if (view === 'workout') {
            closeAllModals();
        } else if (view === 'progress') {
            showProgressModal();
        } else if (view === 'stats') {
            showModal('statsModal');
        } else if (view === 'achievements') {
            showAchievementsModal();
        } else if (view === 'settings') {
            showModal('settingsModal');
        }
    });
});

// ============================================
// MODAL PROGRESSION
// ============================================
function showProgressModal() {
    populateExerciseSelect();
    showModal('progressModal');
}

function populateExerciseSelect() {
    const select = document.getElementById('exerciseSelect');
    select.innerHTML = '<option value="">-- Choisir un exercice --</option>';

    Object.values(workoutProgram).forEach(day => {
        if (day.categories) {
            day.categories.forEach(cat => {
                cat.exercises.forEach(ex => {
                    const optionValue = `${day.name}|${cat.name}|${ex.name}`;
                    select.innerHTML += `<option value="${optionValue}">${ex.name} (${cat.name})</option>`;
                });
            });
        }
    });
}

document.getElementById('exerciseSelect')?.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value) {
        const [day, category, exercise] = value.split('|');
        displayWeightHistory(exercise);
        document.getElementById('addWeightSection').style.display = 'block';
    } else {
        document.getElementById('weightHistory').innerHTML = '';
        document.getElementById('addWeightSection').style.display = 'none';
    }
});

function displayWeightHistory(exercise) {
    const container = document.getElementById('weightHistory');
    const records = V3State.weights[exercise] || [];

    if (records.length === 0) {
        container.innerHTML = '<div class="empty-state-small"><span>💪</span><p>Aucun record pour cet exercice</p></div>';
        return;
    }

    container.innerHTML = records.map((record, index) => `
        <div class="weight-record">
            <div class="weight-record-info">
                <div class="weight-record-value">${record.weight} kg × ${record.reps} reps</div>
                <div class="weight-record-date">${new Date(record.date).toLocaleDateString('fr-FR')}</div>
            </div>
            <button class="weight-record-delete" onclick="deleteWeightRecord('${exercise}', ${index})">🗑️</button>
        </div>
    `).reverse().join('');
}

document.getElementById('saveWeight')?.addEventListener('click', () => {
    const select = document.getElementById('exerciseSelect');
    const weight = parseFloat(document.getElementById('weightInput').value);
    const reps = parseInt(document.getElementById('repsInput').value);

    if (!select.value || !weight || !reps) {
        showToast('❌ Remplissez tous les champs');
        return;
    }

    const [day, category, exercise] = select.value.split('|');

    if (!V3State.weights[exercise]) {
        V3State.weights[exercise] = [];
    }

    V3State.weights[exercise].push({
        weight,
        reps,
        date: Date.now()
    });

    localStorage.setItem('weights', JSON.stringify(V3State.weights));
    displayWeightHistory(exercise);

    document.getElementById('weightInput').value = '';
    document.getElementById('repsInput').value = '';

    showToast('💪 Record sauvegardé !');
    checkAchievements();

    vibrate(50);
});

function deleteWeightRecord(exercise, index) {
    V3State.weights[exercise].splice(index, 1);
    localStorage.setItem('weights', JSON.stringify(V3State.weights));
    displayWeightHistory(exercise);
    showToast('🗑️ Record supprimé');
}

// ============================================
// TABS
// ============================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        const modal = btn.closest('.modal');

        // Update tabs
        modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content
        modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        modal.querySelector(`#${tab}Tab`).classList.add('active');

        if (tab === 'charts') {
            drawSimpleChart();
        } else if (tab === 'photos') {
            displayPhotoGallery();
        }
    });
});

// ============================================
// SIMPLE CHART (Sans bibliothèque)
// ============================================
function drawSimpleChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Simple placeholder chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📊 Graphique de progression', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Ajoutez plus de records pour voir votre évolution', canvas.width / 2, canvas.height / 2 + 30);

    // Calculate stats
    const select = document.getElementById('exerciseSelect');
    if (select.value) {
        const [day, category, exercise] = select.value.split('|');
        const records = V3State.weights[exercise] || [];

        if (records.length > 0) {
            const latest = records[records.length - 1];
            const first = records[0];
            const progress = ((latest.weight - first.weight) / first.weight * 100).toFixed(1);
            const maxWeight = Math.max(...records.map(r => r.weight));

            document.getElementById('totalProgress').textContent = `+${progress}%`;
            document.getElementById('personalRecord').textContent = `${maxWeight}kg`;
        }
    }
}

// ============================================
// GALERIE PHOTOS
// ============================================
document.getElementById('addPhoto')?.addEventListener('click', () => {
    document.getElementById('photoInput').click();
});

document.getElementById('photoInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        V3State.photos.push({
            data: event.target.result,
            date: Date.now()
        });

        localStorage.setItem('photos', JSON.stringify(V3State.photos));
        displayPhotoGallery();
        showToast('📸 Photo ajoutée !');
        checkAchievements();
    };
    reader.readAsDataURL(file);
});

function displayPhotoGallery() {
    const container = document.getElementById('photoGallery');
    if (!container) return;

    if (V3State.photos.length === 0) {
        container.innerHTML = '<div class="empty-state-small"><span>📸</span><p>Aucune photo ajoutée</p></div>';
        return;
    }

    container.innerHTML = V3State.photos.map((photo, index) => `
        <div class="photo-item">
            <img src="${photo.data}" alt="Progress photo">
            <div class="photo-item-date">${new Date(photo.date).toLocaleDateString('fr-FR')}</div>
            <button class="photo-item-delete" onclick="deletePhoto(${index})">×</button>
        </div>
    `).reverse().join('');
}

function deletePhoto(index) {
    V3State.photos.splice(index, 1);
    localStorage.setItem('photos', JSON.stringify(V3State.photos));
    displayPhotoGallery();
    showToast('🗑️ Photo supprimée');
}

// ============================================
// ACHIEVEMENTS
// ============================================
function showAchievementsModal() {
    updateAchievementsDisplay();
    showModal('achievementsModal');
}

function checkAchievements() {
    let unlocked = 0;
    ACHIEVEMENTS.forEach(achievement => {
        if (!V3State.achievements[achievement.id] && achievement.check()) {
            V3State.achievements[achievement.id] = Date.now();
            localStorage.setItem('achievements', JSON.stringify(V3State.achievements));
            showAchievementUnlocked(achievement);
            unlocked++;
        }
    });

    if (unlocked > 0) {
        updateAchievementsDisplay();
    }
}

function showAchievementUnlocked(achievement) {
    showToast(`🏆 Badge débloqué: ${achievement.name}`);
    vibrate([50, 30, 50, 30, 50]);

    // Confetti
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createConfetti(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight / 2
            );
        }, i * 50);
    }
}

function updateAchievementsDisplay() {
    const unlockedCount = Object.keys(V3State.achievements).length;
    const totalBadges = ACHIEVEMENTS.length;
    const percentage = (unlockedCount / totalBadges * 100).toFixed(0);

    document.getElementById('unlockedCount').textContent = unlockedCount;
    document.getElementById('totalBadges').textContent = totalBadges;
    document.getElementById('achievementProgress').style.width = percentage + '%';

    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = ACHIEVEMENTS.map(achievement => {
        const isUnlocked = V3State.achievements[achievement.id];
        const unlockedDate = isUnlocked ? new Date(isUnlocked).toLocaleDateString('fr-FR') : '';

        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${isUnlocked ? `<div class="achievement-unlocked-date">Débloqué le ${unlockedDate}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Check achievements au démarrage et après chaque séance
checkAchievements();

// ============================================
// CALCULATEUR 1RM
// ============================================
document.getElementById('openCalculator')?.addEventListener('click', () => {
    showModal('calculatorModal');
});

document.getElementById('calculate1RM')?.addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('calc1rmWeight').value);
    const reps = parseInt(document.getElementById('calc1rmReps').value);

    if (!weight || !reps || reps < 1) {
        showToast('❌ Entrez des valeurs valides');
        return;
    }

    // Formule de Brzycki
    const oneRM = weight / (1.0278 - 0.0278 * reps);

    document.getElementById('rm1Value').textContent = Math.round(oneRM) + ' kg';
    document.getElementById('rm95').textContent = Math.round(oneRM * 0.95) + ' kg';
    document.getElementById('rm90').textContent = Math.round(oneRM * 0.90) + ' kg';
    document.getElementById('rm85').textContent = Math.round(oneRM * 0.85) + ' kg';
    document.getElementById('rm80').textContent = Math.round(oneRM * 0.80) + ' kg';
    document.getElementById('rm75').textContent = Math.round(oneRM * 0.75) + ' kg';

    document.getElementById('calculator1RMResult').style.display = 'block';

    vibrate(50);
});

// ============================================
// OVERRIDE completeWorkout pour vérifier achievements
// ============================================
const originalCompleteWorkout = completeWorkout;
completeWorkout = function() {
    originalCompleteWorkout();
    setTimeout(() => {
        checkAchievements();
    }, 500);
};

console.log('✅ Musculs Pro V3.0 Ultimate Edition chargé avec succès');
