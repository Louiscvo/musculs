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

console.log('✅ Musculs Pro chargé avec succès');
