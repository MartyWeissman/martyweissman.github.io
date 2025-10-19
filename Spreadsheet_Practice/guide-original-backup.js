// Core guide functionality for spreadsheet instruction
// Handles navigation, help display, and lesson loading

// Default welcome instructions
const welcomeInstructions = `
<div class="instruction-title">Welcome to the Spreadsheet Practice Tool!</div>
<p>This tool will help you learn basic spreadsheet skills. The left side contains a simple spreadsheet with columns (A-E) and rows (1-20).</p>
<p>You can click on any cell to select it. Type to enter data, or use arrow keys to navigate.</p>
<p><strong>Key Features:</strong></p>
<ul>
    <li>Enter numbers or text directly</li>
    <li>Create formulas by starting with = (e.g., =A1+B2*5)</li>
    <li>Supports +, -, *, / operations</li>
    <li>Use SUM(A1:B5) to add all values in a range</li>
    <li>Use AVERAGE(A1:B5) to find the average of a range</li>
    <li>Use absolute references ($A$1, $A1, A$1) to keep cell references fixed when copying formulas</li>
    <li>Copy/paste: Ctrl+C to copy, Ctrl+V to paste, Ctrl+X to cut</li>
    <li>Navigation: Arrow keys to move, Delete/Backspace to clear a cell</li>
</ul>
<p>Choose a lesson from the navigation bar above or click the "Start Practice" button below to begin learning!</p>
`;

// Show feedback message with appropriate styling
function showFeedback(message, type = 'info') {
    const feedbackArea = document.getElementById('feedbackArea');

    let className = '';
    switch(type) {
        case 'success':
            className = 'success-message';
            break;
        case 'error':
            className = 'error-message';
            break;
        case 'info':
        default:
            className = 'info-message';
    }

    feedbackArea.innerHTML = `<p class="${className}">${message}</p>`;
}

// Update instructions content
function updateInstructions(content, title = null) {
    const instructionArea = document.querySelector('.current-instruction');

    if (title) {
        instructionArea.innerHTML = `
            <div class="instruction-title">${title}</div>
            ${content}
        `;
    } else {
        instructionArea.innerHTML = content;
    }

    // Clear feedback area
    document.getElementById('feedbackArea').innerHTML = '';
}

// Show the welcome/help instructions
function showHelpInstructions() {
    updateInstructions(welcomeInstructions);

    // Reset any active lesson buttons
    const lessonButtons = document.querySelectorAll('.lesson-button');
    lessonButtons.forEach(button => button.classList.remove('active'));

    // Reset practice button
    const practiceButton = document.getElementById('practiceButton');
    if (practiceButton) {
        practiceButton.textContent = 'Start Practice';
        practiceButton.style.display = 'block';
    }
}

// Create navigation bar with lesson buttons
function createNavigation() {
    const instructionsContainer = document.querySelector('.instructions-container');

    // Create nav bar
    const navBar = document.createElement('div');
    navBar.className = 'lesson-nav-bar';

    // Create lesson buttons
    for (let i = 1; i <= 5; i++) {
        const lessonButton = document.createElement('button');
        lessonButton.className = 'lesson-button';
        lessonButton.textContent = `Lesson ${i}`;
        lessonButton.dataset.lesson = i;

        // Add event listener to load lesson - simplified approach
        lessonButton.addEventListener('click', function() {
            // The key issue: We need to reload the page to completely reset the environment
            // Rather than just removing scripts, let's use a URL parameter to indicate which lesson to load
            window.location.href = window.location.pathname + '?lesson=' + i;
        });

        navBar.appendChild(lessonButton);
    }

    // Create help button with improved styling
    const helpButton = document.createElement('button');
    helpButton.className = 'help-button';
    helpButton.innerHTML = '<strong>?</strong>'; // Boldfaced question mark
    helpButton.title = 'Show Help';
    helpButton.style.display = 'flex'; // Use flex to center content
    helpButton.style.alignItems = 'center'; // Vertical centering
    helpButton.style.justifyContent = 'center'; // Horizontal centering
    helpButton.style.fontWeight = 'bold'; // Extra bold
    helpButton.style.fontSize = '16px'; // Slightly larger
    helpButton.addEventListener('click', showHelpInstructions);
    navBar.appendChild(helpButton);

    // Insert at the top of the instructions container
    instructionsContainer.insertBefore(navBar, instructionsContainer.firstChild);
}

// Set up the default practice button
function setupDefaultPracticeButton() {
    const practiceButton = document.getElementById('practiceButton');

    if (practiceButton) {
        // Remove any existing event listeners by cloning and replacing
        const newButton = practiceButton.cloneNode(true);
        practiceButton.parentNode.replaceChild(newButton, practiceButton);

        newButton.addEventListener('click', function() {
            if (this.textContent === 'Start Practice') {
                // Load first lesson when clicking Start Practice
                loadLesson(1);

                // Update active button in nav bar
                document.querySelectorAll('.lesson-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                const lesson1Button = document.querySelector('.lesson-button[data-lesson="1"]');
                if (lesson1Button) {
                    lesson1Button.classList.add('active');
                }
            }
        });
    }
}

// Load a specific lesson
function loadLesson(lessonNumber) {
    console.log(`Loading lesson ${lessonNumber}`);

    // Clear the spreadsheet to start fresh
    clearSpreadsheet();

    // Load the lesson script dynamically
    const scriptId = `lesson-${lessonNumber}-script`;

    // Remove existing lesson script if it exists
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
        existingScript.remove();
    }

    // Create and add the new script
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `lesson-${lessonNumber}.js`;
    script.onload = function() {
        // Call the initLesson function if it exists globally
        if (typeof window.initLesson === 'function') {
            window.initLesson();
        } else {
            showFeedback(`Lesson ${lessonNumber} loaded but no initLesson function found.`, 'error');
        }
    };
    script.onerror = function() {
        showFeedback(`Lesson ${lessonNumber} is not available yet.`, 'error');
    };

    document.body.appendChild(script);

    // Update active button in nav bar
    document.querySelectorAll('.lesson-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const lessonButton = document.querySelector(`.lesson-button[data-lesson="${lessonNumber}"]`);
    if (lessonButton) {
        lessonButton.classList.add('active');
    }
}

// Make functions available globally for lesson modules to use
window.updateInstructions = updateInstructions;
window.showFeedback = showFeedback;

// Check URL parameters for direct lesson loading
function checkURLForLesson() {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonParam = urlParams.get('lesson');

    if (lessonParam && !isNaN(parseInt(lessonParam))) {
        const lessonNumber = parseInt(lessonParam);
        if (lessonNumber >= 1 && lessonNumber <= 10) {
            // Short delay to ensure everything is initialized
            setTimeout(() => loadLesson(lessonNumber), 100);
            return true;
        }
    }
    return false;
}

// Initialize everything when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create the navigation bar
    createNavigation();

    // Check if we should load a specific lesson from URL
    if (!checkURLForLesson()) {
        // No lesson specified, show welcome instructions
        showHelpInstructions();
    }

    // Set up practice button
    setupDefaultPracticeButton();
});

// Also initialize immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        createNavigation();
        if (!checkURLForLesson()) {
            showHelpInstructions();
        }
        setupDefaultPracticeButton();
    }, 1);
}
