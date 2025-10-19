// Simple, reliable lesson navigation system
// Designed for maximum cross-browser compatibility

(function() {
    'use strict';

    // Simple URL parameter parser (compatible with all browsers)
    function getURLParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results === null ? null : decodeURIComponent(results[1]) || null;
    }

    // Safe element selection
    function getElement(id) {
        return document.getElementById(id);
    }

    // Show feedback safely
    function showFeedback(message, type) {
        var feedbackArea = getElement('feedbackArea');
        if (!feedbackArea) return;

        var className = type === 'error' ? 'error-message' :
                       type === 'success' ? 'success-message' : 'info-message';

        feedbackArea.innerHTML = '<p class="' + className + '">' + message + '</p>';
    }

    // Update instructions safely
    function updateInstructions(content, title) {
        var instructionArea = document.querySelector('.current-instruction');
        if (!instructionArea) return;

        var html = content;
        if (title) {
            html = '<div class="instruction-title">' + title + '</div>' + content;
        }

        instructionArea.innerHTML = html;

        // Clear feedback
        var feedbackArea = getElement('feedbackArea');
        if (feedbackArea) feedbackArea.innerHTML = '';
    }

    // Welcome content
    var welcomeContent = `
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

    // Show welcome screen
    function showWelcome() {
        updateInstructions(welcomeContent);

        // Reset lesson buttons
        var buttons = document.querySelectorAll('.lesson-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }

        // Reset practice button
        var practiceBtn = getElement('practiceButton');
        if (practiceBtn) {
            practiceBtn.textContent = 'Start Practice';
            practiceBtn.style.display = 'block';
        }
    }

    // Load lesson with direct approach (no page reload)
    function loadLesson(lessonNum) {
        lessonNum = parseInt(lessonNum);

        if (lessonNum < 1 || lessonNum > 5) {
            showFeedback('Invalid lesson number', 'error');
            return;
        }

        console.log('Loading lesson ' + lessonNum);

        // Clear spreadsheet if possible
        if (typeof window.clearSpreadsheet === 'function') {
            try {
                window.clearSpreadsheet();
            } catch (e) {
                console.warn('Could not clear spreadsheet');
            }
        }

        // Update active button
        var buttons = document.querySelectorAll('.lesson-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }

        var activeBtn = document.querySelector('.lesson-button[data-lesson="' + lessonNum + '"]');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Remove existing lesson script
        var oldScript = getElement('current-lesson-script');
        if (oldScript) {
            oldScript.parentNode.removeChild(oldScript);
        }

        // Clear existing lesson function
        window.initLesson = undefined;

        // Load new lesson script
        var script = document.createElement('script');
        script.id = 'current-lesson-script';
        script.src = 'lesson-' + lessonNum + '.js';

        script.onload = function() {
            // Give script time to define functions
            setTimeout(function() {
                if (typeof window.initLesson === 'function') {
                    try {
                        window.initLesson();
                        showFeedback('Lesson ' + lessonNum + ' loaded!', 'success');
                    } catch (e) {
                        showFeedback('Lesson ' + lessonNum + ' failed to start', 'error');
                        console.error('Lesson init error:', e);
                    }
                } else {
                    showFeedback('Lesson ' + lessonNum + ' file loaded but missing initialization', 'error');
                }
            }, 100);
        };

        script.onerror = function() {
            showFeedback('Could not load lesson ' + lessonNum + '. Please refresh and try again.', 'error');
        };

        document.body.appendChild(script);
    }

    // Create navigation buttons
    function createNavigation() {
        var container = document.querySelector('.instructions-container');
        if (!container) return;

        // Don't create twice
        if (document.querySelector('.lesson-nav-bar')) return;

        var navBar = document.createElement('div');
        navBar.className = 'lesson-nav-bar';

        // Create lesson buttons
        for (var i = 1; i <= 5; i++) {
            var btn = document.createElement('button');
            btn.className = 'lesson-button';
            btn.textContent = 'Lesson ' + i;
            btn.setAttribute('data-lesson', i);

            // Use closure to capture lesson number
            (function(num) {
                btn.onclick = function() {
                    loadLesson(num);
                };
            })(i);

            navBar.appendChild(btn);
        }

        // Help button
        var helpBtn = document.createElement('button');
        helpBtn.className = 'help-button';
        helpBtn.innerHTML = '<strong>?</strong>';
        helpBtn.title = 'Show Help';
        helpBtn.onclick = showWelcome;

        navBar.appendChild(helpBtn);

        // Insert at top
        container.insertBefore(navBar, container.firstChild);
    }

    // Setup practice button
    function setupPracticeButton() {
        var btn = getElement('practiceButton');
        if (!btn) return;

        // Replace to remove old listeners
        var newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.onclick = function() {
            if (this.textContent === 'Start Practice') {
                loadLesson(1);
            }
        };
    }

    // Initialize everything
    function init() {
        createNavigation();
        setupPracticeButton();

        // Check URL for lesson parameter
        var lessonParam = getURLParam('lesson');
        if (lessonParam && lessonParam >= 1 && lessonParam <= 5) {
            setTimeout(function() {
                loadLesson(lessonParam);
            }, 200);
        } else {
            showWelcome();
        }
    }

    // Make functions available globally
    window.updateInstructions = updateInstructions;
    window.showFeedback = showFeedback;
    window.loadLesson = loadLesson;

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1);
    }

})();
