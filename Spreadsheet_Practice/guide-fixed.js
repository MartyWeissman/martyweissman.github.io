// Robust guide functionality for spreadsheet instruction
// Enhanced for cross-browser compatibility and reliability

// Namespace to avoid global conflicts
const SpreadsheetGuide = (function() {
    'use strict';

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

    // Current lesson state
    let currentLesson = 0;
    let isInitialized = false;
    let lessonScripts = {};

    // Cross-browser compatible URL parameter parser
    function getURLParameter(name) {
        try {
            // Modern browser approach
            if (typeof URLSearchParams !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                return params.get(name);
            }
        } catch (e) {
            // Fall back to manual parsing
        }

        // Fallback for older browsers
        const regex = new RegExp('[\\?&]' + name.replace(/[\[\]]/g, '\\$&') + '=([^&#]*)');
        const results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Safe DOM element finder with fallback
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            console.warn('Query selector failed:', selector, e);
            return null;
        }
    }

    // Safe DOM element finder for multiple elements
    function safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (e) {
            console.warn('Query selector all failed:', selector, e);
            return [];
        }
    }

    // Show feedback message with appropriate styling
    function showFeedback(message, type) {
        type = type || 'info';
        const feedbackArea = document.getElementById('feedbackArea');

        if (!feedbackArea) {
            console.warn('Feedback area not found');
            return;
        }

        let className = 'info-message';
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

        feedbackArea.innerHTML = '<p class="' + className + '">' + message + '</p>';
    }

    // Update instructions content safely
    function updateInstructions(content, title) {
        const instructionArea = safeQuerySelector('.current-instruction');

        if (!instructionArea) {
            console.warn('Instruction area not found');
            return;
        }

        var htmlContent = content;
        if (title) {
            htmlContent = '<div class="instruction-title">' + title + '</div>' + content;
        }

        instructionArea.innerHTML = htmlContent;

        // Clear feedback area safely
        const feedbackArea = document.getElementById('feedbackArea');
        if (feedbackArea) {
            feedbackArea.innerHTML = '';
        }
    }

    // Show the welcome/help instructions
    function showHelpInstructions() {
        updateInstructions(welcomeInstructions);

        // Reset any active lesson buttons
        const lessonButtons = safeQuerySelectorAll('.lesson-button');
        for (let i = 0; i < lessonButtons.length; i++) {
            lessonButtons[i].classList.remove('active');
        }

        // Reset practice button
        const practiceButton = document.getElementById('practiceButton');
        if (practiceButton) {
            practiceButton.textContent = 'Start Practice';
            practiceButton.style.display = 'block';
        }

        currentLesson = 0;
    }

    // Safe event listener addition
    function addEventListenerSafe(element, event, handler) {
        if (element && typeof element.addEventListener === 'function') {
            element.addEventListener(event, handler);
            return true;
        } else if (element && element.attachEvent) {
            // IE8 fallback
            element.attachEvent('on' + event, handler);
            return true;
        }
        return false;
    }

    // Create navigation bar with lesson buttons
    function createNavigation() {
        const instructionsContainer = safeQuerySelector('.instructions-container');

        if (!instructionsContainer) {
            console.warn('Instructions container not found');
            return;
        }

        // Check if navigation already exists
        if (safeQuerySelector('.lesson-nav-bar')) {
            return; // Already created
        }

        // Create nav bar
        const navBar = document.createElement('div');
        navBar.className = 'lesson-nav-bar';

        // Create lesson buttons
        for (let i = 1; i <= 5; i++) {
            const lessonButton = document.createElement('button');
            lessonButton.className = 'lesson-button';
            lessonButton.textContent = 'Lesson ' + i;
            lessonButton.setAttribute('data-lesson', i);

            // Use closure to capture lesson number
            (function(lessonNum) {
                addEventListenerSafe(lessonButton, 'click', function() {
                    loadLesson(lessonNum);
                });
            })(i);

            navBar.appendChild(lessonButton);
        }

        // Create help button
        const helpButton = document.createElement('button');
        helpButton.className = 'help-button';
        helpButton.innerHTML = '<strong>?</strong>';
        helpButton.title = 'Show Help';
        helpButton.style.display = 'flex';
        helpButton.style.alignItems = 'center';
        helpButton.style.justifyContent = 'center';
        helpButton.style.fontWeight = 'bold';
        helpButton.style.fontSize = '16px';

        addEventListenerSafe(helpButton, 'click', showHelpInstructions);
        navBar.appendChild(helpButton);

        // Insert at the top of the instructions container
        instructionsContainer.insertBefore(navBar, instructionsContainer.firstChild);
    }

    // Load a specific lesson with improved error handling
    function loadLesson(lessonNumber) {
        lessonNumber = parseInt(lessonNumber);

        if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
            showFeedback('Invalid lesson number: ' + lessonNumber, 'error');
            return;
        }

        console.log('Loading lesson ' + lessonNumber);
        currentLesson = lessonNumber;

        // Clear the spreadsheet if function exists
        if (typeof window.clearSpreadsheet === 'function') {
            try {
                window.clearSpreadsheet();
            } catch (e) {
                console.warn('Could not clear spreadsheet:', e);
            }
        }

        // Update active button in nav bar
        const lessonButtons = safeQuerySelectorAll('.lesson-button');
        for (let i = 0; i < lessonButtons.length; i++) {
            lessonButtons[i].classList.remove('active');
        }

        const activeButton = safeQuerySelector('.lesson-button[data-lesson="' + lessonNumber + '"]');
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Load the lesson script if not already loaded
        loadLessonScript(lessonNumber);
    }

    // Load lesson script with robust error handling
    function loadLessonScript(lessonNumber) {
        const scriptId = 'lesson-' + lessonNumber + '-script';

        // Remove existing lesson script if it exists
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            try {
                existingScript.parentNode.removeChild(existingScript);
            } catch (e) {
                console.warn('Could not remove existing script:', e);
            }
        }

        // Clear any existing lesson initialization function
        if (typeof window.initLesson === 'function') {
            try {
                delete window.initLesson;
            } catch (e) {
                // Some browsers don't allow deleting window properties
                window.initLesson = undefined;
            }
        }

        // Create and add the new script
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'text/javascript';
        script.src = 'lesson-' + lessonNumber + '.js';

        // Set up success handler
        script.onload = function() {
            setTimeout(function() {
                initializeLesson(lessonNumber);
            }, 50); // Small delay to ensure script is fully processed
        };

        // Set up error handler
        script.onerror = function() {
            showFeedback('Lesson ' + lessonNumber + ' could not be loaded. Please try refreshing the page.', 'error');
            console.error('Failed to load lesson script:', script.src);
        };

        // For older IE browsers
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    setTimeout(function() {
                        initializeLesson(lessonNumber);
                    }, 50);
                }
            };
        }

        // Add to document
        try {
            document.body.appendChild(script);
        } catch (e) {
            showFeedback('Could not load lesson ' + lessonNumber + '. Please try refreshing the page.', 'error');
            console.error('Could not append script to body:', e);
        }
    }

    // Initialize lesson after script loads
    function initializeLesson(lessonNumber) {
        // Check if the initLesson function exists
        if (typeof window.initLesson === 'function') {
            try {
                window.initLesson();
                showFeedback('Lesson ' + lessonNumber + ' loaded successfully!', 'success');
            } catch (e) {
                showFeedback('Lesson ' + lessonNumber + ' loaded but failed to initialize properly.', 'error');
                console.error('Lesson initialization error:', e);
            }
        } else {
            showFeedback('Lesson ' + lessonNumber + ' loaded but no initialization function found.', 'error');
            console.warn('No initLesson function found after loading lesson', lessonNumber);
        }
    }

    // Set up the default practice button
    function setupDefaultPracticeButton() {
        const practiceButton = document.getElementById('practiceButton');

        if (!practiceButton) {
            console.warn('Practice button not found');
            return;
        }

        // Remove any existing event listeners by cloning and replacing
        const newButton = practiceButton.cloneNode(true);
        practiceButton.parentNode.replaceChild(newButton, practiceButton);

        addEventListenerSafe(newButton, 'click', function() {
            if (this.textContent === 'Start Practice') {
                loadLesson(1);
            }
        });
    }

    // Check URL parameters for direct lesson loading
    function checkURLForLesson() {
        const lessonParam = getURLParameter('lesson');

        if (lessonParam && lessonParam !== '') {
            const lessonNumber = parseInt(lessonParam);
            if (!isNaN(lessonNumber) && lessonNumber >= 1 && lessonNumber <= 5) {
                setTimeout(function() {
                    loadLesson(lessonNumber);
                }, 200); // Longer delay to ensure everything is initialized
                return true;
            }
        }
        return false;
    }

    // Main initialization function
    function initialize() {
        if (isInitialized) {
            return; // Prevent double initialization
        }

        try {
            // Create the navigation bar
            createNavigation();

            // Check if we should load a specific lesson from URL
            if (!checkURLForLesson()) {
                // No lesson specified, show welcome instructions
                showHelpInstructions();
            }

            // Set up practice button
            setupDefaultPracticeButton();

            isInitialized = true;
            console.log('SpreadsheetGuide initialized successfully');

        } catch (e) {
            console.error('SpreadsheetGuide initialization failed:', e);
        }
    }

    // Cross-browser compatible DOM ready detection
    function onDOMReady(callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(callback, 1);
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback);
        } else if (document.attachEvent) {
            // IE8 fallback
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState === 'complete') {
                    callback();
                }
            });
        }
    }

    // Public API - expose functions that other scripts need to access
    const publicAPI = {
        updateInstructions: updateInstructions,
        showFeedback: showFeedback,
        loadLesson: loadLesson,
        initialize: initialize,
        showHelpInstructions: showHelpInstructions
    };

    // Make functions available globally for lesson modules
    window.updateInstructions = updateInstructions;
    window.showFeedback = showFeedback;

    // Initialize when DOM is ready
    onDOMReady(initialize);

    return publicAPI;
})();

// Make the guide available globally
window.SpreadsheetGuide = SpreadsheetGuide;
