let timer;
let timeLeft = 60;
let currentRound = 0;
let totalRounds;
let isRunning = false;
let noSleep = new NoSleep();

const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const roundsInput = document.getElementById('roundsInput');
const currentRoundDisplay = document.getElementById('currentRound');
const totalRoundsDisplay = document.getElementById('totalRounds');

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (!isRunning) {
        noSleep.enable().then(() => {
            isRunning = true;
            startBtn.textContent = 'Pause';
            
            if (currentRound === 0) {
                totalRounds = parseInt(roundsInput.value);
                timeLeft = 60;
                currentRound = 1;
                updateRoundDisplay();
            }

            // Test immediate update
            console.log('Initial timeLeft:', timeLeft);
            secondsDisplay.textContent = timeLeft.toString().padStart(2, '0');
            
            // Create new interval
            clearInterval(timer);
            timer = setInterval(function() {
                console.log('Interval tick');
                if (timeLeft > 0) {
                    timeLeft--;
                    secondsDisplay.textContent = timeLeft.toString().padStart(2, '0');
                    console.log('New time:', timeLeft);
                } else {
                    playBeep();
                    if (currentRound < totalRounds) {
                        currentRound++;
                        updateRoundDisplay();
                        timeLeft = 60;
                        secondsDisplay.textContent = timeLeft.toString().padStart(2, '0');
                    } else {
                        completeWorkout();
                    }
                }
            }, 1000);
        }).catch((error) => {
            console.error('Failed to enable wake lock:', error);
        });
    }
}

function pauseTimer() {
    isRunning = false;
    startBtn.textContent = 'Start';
    clearInterval(timer);
    noSleep.disable();
}

function resetTimer() {
    pauseTimer();
    timeLeft = 60;
    currentRound = 0;
    updateDisplay();
    updateRoundDisplay();
    startBtn.textContent = 'Start';
}

function updateDisplay() {
    console.log('Updating display with:', timeLeft);
    secondsDisplay.textContent = timeLeft.toString().padStart(2, '0');
    console.log('Display now shows:', secondsDisplay.textContent);
}

function updateRoundDisplay() {
    currentRoundDisplay.textContent = currentRound;
}

function completeWorkout() {
    pauseTimer();
    alert('Workout Complete!');
    resetTimer();
}

function playBeep() {
    const bell = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    
    // Add error handling
    bell.onerror = function() {
        console.error('Error playing sound');
        // Fallback to browser beep as last resort
        try {
            window.navigator.vibrate(200); // Vibrate on mobile devices
        } catch (e) {
            console.log('Vibration not supported');
        }
    };

    // Add load handling
    bell.onloadeddata = function() {
        bell.play().catch(function(error) {
            console.log('Play failed:', error);
            // Some browsers require user interaction before playing audio
            // We'll just log this error as it's expected in some cases
        });
    };
}

// Initialize display
updateDisplay();
updateRoundDisplay(); 