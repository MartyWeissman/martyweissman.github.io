// Lesson 5: Delay Equations and Advanced Cell References
// Implementation of the delay change equation Delta X / Delta t = 100 - 0.5 X(t - 1)

// Store student name when it's entered
let studentName = "student";

// Define the lesson exercises
const lesson5Exercises = [
    {
        title: "Exercise 5.1: Setting Up a Delay Equation Model",
        instruction:
            `<p>In this lesson, we'll explore <strong>delay equations</strong> and how to implement them in spreadsheets.</p>
            <p>The equation we'll work with is: <strong>ΔX / Δt = 100 - 0.5 X(t - 1)</strong></p>
            <p>This is different from our previous models because it uses <strong>X(t - 1)</strong> — the value of X from the previous time step — rather than the current value of X.</p>
            <p>Delay equations appear in many real-world systems where effects take time to manifest:</p>
            <ul>
                <li>Economic cycles with delayed market responses</li>
                <li>Population dynamics with generation delays</li>
                <li>Physiological systems with feedback delays</li>
            </ul>
            <p>Let's set up our spreadsheet:</p>
            <ol>
                <li>Enter "Time (t)" in cell A1 as the header for our time column</li>
                <li>Enter "X" in cell B1 as the header for our variable</li>
                <li>Enter "Delta t" in cell C1 (this will track the time step)</li>
                <li>Enter "Delta X" in cell D1 (this will track the change in X)</li>
                <li>Enter your name in cell E1 (this will be used for your verification code)</li>
            </ol>
            <p>Click "Check Answer" when you've set up the headers.</p>`,
        validate: function() {
            // Check if headers are correct
            const timeHeader = getCellData('A1');
            const xHeader = getCellData('B1');
            const dtHeader = getCellData('C1');
            const dxHeader = getCellData('D1');
            const nameCell = getCellData('E1');

            // Store the student's name for later use
            if (nameCell.type === 'text' && nameCell.value.trim() !== '') {
                studentName = nameCell.value.trim();
            }

            return timeHeader.type === 'text' &&
                   timeHeader.value.toLowerCase().includes('time') &&
                   xHeader.type === 'text' &&
                   xHeader.value.toLowerCase().includes('x') &&
                   dtHeader.type === 'text' &&
                   dtHeader.value.toLowerCase().includes('delta t') &&
                   dxHeader.type === 'text' &&
                   dxHeader.value.toLowerCase().includes('delta x') &&
                   nameCell.type === 'text' &&
                   nameCell.value.trim() !== '';
        },
        getErrorMessage: function() {
            // Detailed error messages
            const timeHeader = getCellData('A1');
            const xHeader = getCellData('B1');
            const dtHeader = getCellData('C1');
            const dxHeader = getCellData('D1');
            const nameCell = getCellData('E1');

            if (timeHeader.type !== 'text' || !timeHeader.value.toLowerCase().includes('time')) {
                return "Please enter 'Time (t)' as text in cell A1.";
            }

            if (xHeader.type !== 'text' || !xHeader.value.toLowerCase().includes('x')) {
                return "Please enter 'X' as text in cell B1.";
            }

            if (dtHeader.type !== 'text' || !dtHeader.value.toLowerCase().includes('delta t')) {
                return "Please enter 'Delta t' as text in cell C1.";
            }

            if (dxHeader.type !== 'text' || !dxHeader.value.toLowerCase().includes('delta x')) {
                return "Please enter 'Delta X' as text in cell D1.";
            }

            if (nameCell.type !== 'text' || nameCell.value.trim() === '') {
                return "Please enter your name in cell E1.";
            }

            return "Please check all header cells and try again.";
        },
        getSuccessMessage: function() {
            return `Great job, ${studentName}! You've set up the headers for our delay equation model.
            <p>Delay equations are fascinating because they have "memory" — the current change depends on past values rather than just the current state.</p>
            <p>This type of equation can produce much more complex behavior than the immediate feedback models we've seen previously. In some cases, they can lead to oscillations, chaos, or other interesting patterns.</p>
            <p>In spreadsheets, implementing delay equations requires careful use of cell references, which we'll explore in this lesson.</p>`;
        }
    },
    {
        title: "Exercise 5.2: Setting Initial Conditions",
        instruction: function() {
            return `
                <p>Now, ${studentName}, let's set up our initial conditions. Since this is a delay equation, we need <strong>two</strong> initial values to get started.</p>
                <p>The equation ΔX / Δt = 100 - 0.5 X(t - 1) relates the change in X to the value of X from one time step earlier. This means:</p>
                <ul>
                    <li>To calculate ΔX at time t=0, we need to know X at time t=-1</li>
                    <li>To calculate X at time t=1, we need both X at t=0 and ΔX at t=0</li>
                </ul>
                <p>Let's set up these initial conditions:</p>
                <ol>
                    <li>In cell A2, enter -1 (this represents t=-1, one time step before our starting point)</li>
                    <li>In cell B2, enter 20 (this is our initial value of X at t=-1)</li>
                    <li>In cell A3, enter 0 (this represents t=0, our starting point)</li>
                    <li>In cell B3, enter 30 (this is our initial value of X at t=0)</li>
                    <li>In cells C2 and C3, enter 1 (this is our time step Δt=1)</li>
                </ol>
                <p>Click "Check Answer" when you've entered these initial values.</p>
            `;
        },
        validate: function() {
            // Check initial values
            const time1 = getCellData('A2');
            const x1 = getCellData('B2');
            const dt1 = getCellData('C2');

            const time2 = getCellData('A3');
            const x2 = getCellData('B3');
            const dt2 = getCellData('C3');

            return time1.type === 'number' &&
                   time1.result === -1 &&
                   x1.type === 'number' &&
                   x1.result === 20 &&
                   dt1.type === 'number' &&
                   dt1.result === 1 &&
                   time2.type === 'number' &&
                   time2.result === 0 &&
                   x2.type === 'number' &&
                   x2.result === 30 &&
                   dt2.type === 'number' &&
                   dt2.result === 1;
        },
        getErrorMessage: function() {
            const time1 = getCellData('A2');
            const x1 = getCellData('B2');
            const dt1 = getCellData('C2');

            const time2 = getCellData('A3');
            const x2 = getCellData('B3');
            const dt2 = getCellData('C3');

            if (time1.type !== 'number' || time1.result !== -1) {
                return "Please enter -1 as a number in cell A2 for the time t=-1.";
            }

            if (x1.type !== 'number' || x1.result !== 20) {
                return "Please enter 20 as a number in cell B2 for the initial value of X at t=-1.";
            }

            if (time2.type !== 'number' || time2.result !== 0) {
                return "Please enter 0 as a number in cell A3 for the time t=0.";
            }

            if (x2.type !== 'number' || x2.result !== 30) {
                return "Please enter 30 as a number in cell B3 for the initial value of X at t=0.";
            }

            if (dt1.type !== 'number' || dt1.result !== 1 || dt2.type !== 'number' || dt2.result !== 1) {
                return "Please enter 1 as a number in cells C2 and C3 for the time step Δt.";
            }

            return "Please check all initial values and try again.";
        },
        getSuccessMessage: function() {
            return `Excellent work, ${studentName}! You've set up the initial conditions for our delay equation model:
            <ul>
                <li>At time t=-1: X = 20</li>
                <li>At time t=0: X = 30</li>
                <li>Time step Δt = 1</li>
            </ul>
            <p>Unlike our previous models that needed only one initial value, delay equations require multiple initial values because they depend on the system's history.</p>
            <p>Next, we'll implement the delay equation to calculate how X changes over time.</p>`;
        }
    },
    {
        title: "Exercise 5.3: Implementing the Delay Equation",
        instruction: function() {
            return `
                <p>${studentName}, now we'll implement our delay equation:</p>
                <p><strong>ΔX / Δt = 100 - 0.5 X(t - 1)</strong></p>
                <p>Since Δt = 1, this simplifies to: <strong>ΔX = 100 - 0.5 X(t - 1)</strong></p>
                <p>Now we need to calculate ΔX at time t=0:</p>
                <ol>
                    <li>In cell D3, enter a formula that implements our delay equation</li>
                </ol>
                <p>Remember, for t=0, the equation uses X(t-1), which is X at t=-1. This value is in cell B2.</p>
                <p>Your formula should reference the correct cell for X(t-1).</p>
                <p>Click "Check Answer" when you've implemented the equation.</p>
            `;
        },
        validate: function() {
            // Check delay equation implementation
            const dxFormula = getCellData('D3');

            // Check if formula correctly implements ΔX = 100 - 0.5 X(t-1)
            // For t=0 (cell D3), X(t-1) is in cell B2
            const formulaCorrect = dxFormula.type === 'formula' &&
                                   (dxFormula.formula.toLowerCase().replace(/\s+/g, '').includes('100-0.5*b2') ||
                                    dxFormula.formula.toLowerCase().replace(/\s+/g, '').includes('100-0.5b2') ||
                                    dxFormula.formula.toLowerCase().replace(/\s+/g, '').includes('100-0.5*b2'));

            // Expected result for ΔX at t=0: 100 - 0.5*20 = 90
            const resultCorrect = Math.abs(dxFormula.result - 90) < 0.001;

            return formulaCorrect && resultCorrect;
        },
        getErrorMessage: function() {
            const dxFormula = getCellData('D3');

            if (dxFormula.type !== 'formula') {
                return "Cell D3 should contain a formula. Make sure to start with an equals sign (=).";
            }

            if (!dxFormula.formula.toLowerCase().replace(/\s+/g, '').includes('b2')) {
                return "Your formula should reference cell B2, which contains X(t-1) for t=0.";
            }

            if (Math.abs(dxFormula.result - 90) >= 0.001) {
                return "The ΔX calculation isn't correct. For X(t-1)=20, ΔX should be 100 - 0.5*20 = 90.";
            }

            return "Please check your delay equation implementation and try again.";
        },
        getSuccessMessage: function() {
            return `Well done, ${studentName}! You've correctly implemented the delay equation.
            <p>For time t=0:</p>
            <ul>
                <li>X(t-1) = 20 (from cell B2)</li>
                <li>ΔX = 100 - 0.5*20 = 90 (calculated in cell D3)</li>
            </ul>
            <p>The key insight here is that your formula references the X value from the row above, creating the delay of one time step.</p>
            <p>This relationship between the delay term X(t-1) and the cell reference pattern is what makes spreadsheets particularly well-suited for implementing delay equations.</p>
            <p>Next, we'll create formulas to update the system for future time steps.</p>`;
        }
    },
    {
        title: "Exercise 5.4: Extending the Model with Time Update Formulas",
        instruction: function() {
            return `
                <p>${studentName}, now let's set up formulas to extend our model to future time steps:</p>
                <ol>
                    <li>In cell A4, enter a formula to calculate t=1 (hint: add Δt to the previous time)</li>
                    <li>In cell B4, enter a formula to calculate X at t=1 (hint: add ΔX to X at t=0)</li>
                </ol>
                <p>These formulas will use the same pattern as our previous models:</p>
                <ul>
                    <li>New time = previous time + Δt</li>
                    <li>New X = previous X + ΔX</li>
                </ul>
                <p>Click "Check Answer" when you've created these formulas.</p>
            `;
        },
        validate: function() {
            // Check update formulas
            const timeUpdate = getCellData('A4');
            const xUpdate = getCellData('B4');

            // Is the time formula correct?
            const timeFormulaCorrect = timeUpdate.type === 'formula' &&
                                       timeUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('a3+c3') &&
                                       timeUpdate.result === 1;

            // Is the X update formula correct?
            const xFormulaCorrect = xUpdate.type === 'formula' &&
                                    xUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('b3+d3') &&
                                    Math.abs(xUpdate.result - 120) < 0.001; // 30 + 90 = 120

            return timeFormulaCorrect && xFormulaCorrect;
        },
        getErrorMessage: function() {
            const timeUpdate = getCellData('A4');
            const xUpdate = getCellData('B4');

            if (timeUpdate.type !== 'formula') {
                return "Cell A4 should contain a formula to update the time. Try =A3+C3";
            }

            if (!timeUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('a3+c3')) {
                return "The formula in cell A4 should add the time step to the previous time (=A3+C3).";
            }

            if (timeUpdate.result !== 1) {
                return "The time formula isn't calculating correctly. Check that cells A3 and C3 contain the correct values.";
            }

            if (xUpdate.type !== 'formula') {
                return "Cell B4 should contain a formula to update X. Try =B3+D3";
            }

            if (!xUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('b3+d3')) {
                return "The formula in cell B4 should add ΔX to the previous X value (=B3+D3).";
            }

            if (Math.abs(xUpdate.result - 120) >= 0.001) {
                return "The X update formula isn't calculating correctly. X at t=1 should be X(0) + ΔX = 30 + 90 = 120.";
            }

            return "Please check your formulas and try again.";
        },
        getSuccessMessage: function() {
            return `Excellent, ${studentName}! You've created formulas to extend the model:
            <ul>
                <li>Time t=1: 0 + 1 = 1</li>
                <li>X at t=1: 30 + 90 = 120</li>
            </ul>
            <p>Now we're ready to complete the model by implementing the delay equation for future time steps.</p>`;
        }
    },
    {
        title: "Exercise 5.5: Completing the Delay Model",
        instruction: function() {
            return `
                <p>Now for the crucial step, ${studentName}. We need to calculate ΔX for time t=1 using our delay equation:</p>
                <p><strong>ΔX = 100 - 0.5 X(t - 1)</strong></p>
                <ol>
                    <li>In cell C4, enter 1 for the time step</li>
                    <li>In cell D4, enter a formula to calculate ΔX at t=1</li>
                </ol>
                <p><strong>Important:</strong> For t=1, the delay term X(t-1) refers to X at t=0, which is in cell B3.</p>
                <p>Notice the pattern: when calculating ΔX in row n, you need to reference X in row n-1.</p>
                <p>After creating these formulas, copy and paste the formulas in row 4 (cells A4:D4) down through row 8 to extend the model.</p>
                <p>Click "Check Answer" when you've completed the model through row 8.</p>
            `;
        },
        validate: function() {
            // Check that the model is correctly extended through row 8
            // First check cell D4 (the delay equation for t=1)
            const dt4 = getCellData('C4');
            const dx4 = getCellData('D4');

            // Then check the final row values
            const time8 = getCellData('A8');
            const x8 = getCellData('B8');
            const dt8 = getCellData('C8');
            const dx8 = getCellData('D8');

            // Check D4 formula (for t=1, should reference B3 which contains X at t=0)
            const d4FormulaCorrect = dx4.type === 'formula' &&
                                    (dx4.formula.toLowerCase().replace(/\s+/g, '').includes('100-0.5*b3') ||
                                     dx4.formula.toLowerCase().replace(/\s+/g, '').includes('100-0.5b3')) &&
                                    Math.abs(dx4.result - 85) < 0.001; // 100 - 0.5*30 = 85

            // Check time step values
            const dtCorrect = dt4.result === 1 && dt8.result === 1;

            // Check that the model extends to t=5
            const timeCorrect = time8.type === 'formula' && time8.result === 5;

            // Check that formulas are used throughout
            const formulasCorrect = x8.type === 'formula' && dx8.type === 'formula';

            return d4FormulaCorrect && dtCorrect && timeCorrect && formulasCorrect;
        },
        getErrorMessage: function() {
            const dt4 = getCellData('C4');
            const dx4 = getCellData('D4');
            const time8 = getCellData('A8');
            const x8 = getCellData('B8');
            const dx8 = getCellData('D8');

            if (dt4.result !== 1) {
                return "Make sure cell C4 contains the time step Δt = 1.";
            }

            if (dx4.type !== 'formula') {
                return "Cell D4 should contain a formula implementing the delay equation.";
            }

            if (!dx4.formula.toLowerCase().replace(/\s+/g, '').includes('b3')) {
                return "The formula in cell D4 should reference cell B3, which contains X(t-1) for t=1.";
            }

            if (Math.abs(dx4.result - 85) >= 0.001) {
                return "The ΔX calculation in cell D4 isn't correct. For X(t-1)=30, ΔX should be 100 - 0.5*30 = 85.";
            }

            if (time8.type !== 'formula' || time8.result !== 5) {
                return "Make sure you've extended the time formula through row 8. Cell A8 should show time = 5.";
            }

            if (x8.type !== 'formula') {
                return "Make sure you've extended the X formula through cell B8.";
            }

            if (dx8.type !== 'formula') {
                return "Make sure you've extended the delay equation formula through cell D8.";
            }

            return "Please check that all formulas through row 8 are working correctly and follow the delay equation pattern.";
        },
        getSuccessMessage: function() {
            // Generate verification code
            let verificationCode = "XXXXX";
            if (typeof window.makeVerification === 'function') {
                verificationCode = window.makeVerification(studentName, 5);
            }

            return `Outstanding work, ${studentName}! You've successfully implemented a delay equation model.

            <p><strong>Key insights from this lesson:</strong></p>
            <ul>
                <li>Delay equations depend on past values of variables</li>
                <li>In spreadsheets, these delays manifest as references to previous rows</li>
                <li>The pattern of relative references is crucial for correctly implementing the time delay</li>
            </ul>

            <p><strong>About the model's behavior:</strong></p>
            <p>You should notice that the values of X oscillate rather than settling at a single value. This is a common feature of delay equations - they often produce oscillatory behavior because the system reacts to past conditions rather than current ones.</p>

            <p>This type of delayed feedback is found in many real systems:</p>
            <ul>
                <li>Business cycles where production responds to past demand</li>
                <li>Predator-prey relationships with generational delays</li>
                <li>Physiological systems like blood pressure regulation</li>
                <li>Economic models where policy changes take time to affect markets</li>
            </ul>

            <p><strong>Your verification code for Lesson 5 is: ${verificationCode}</strong></p>
            <p>Please provide this code to your instructor to verify completion of this lesson.</p>

            <p>Congratulations on completing this exploration of delay equations and advanced cell references in spreadsheets!</p>`;
        }
    }
];

let currentExerciseIndex = 0;
let practiceButton;

// Initialize the lesson - function must be globally available
function initLesson() {
    console.log("Initializing Lesson 5");

    // Clear the spreadsheet to start fresh
    clearSpreadsheet();

    // Reset the student name to default at the start of the lesson
    studentName = "student";

    // Display the lesson introduction
    showLessonIntroduction();

    // Set up the practice button for this lesson
    setupPracticeButton();
}

// Make the initialization function available globally
window.initLesson = initLesson;

// Show the lesson introduction
function showLessonIntroduction() {
    const introduction = `
        <div class="instruction-title">Lesson 5: Delay Equations and Advanced Cell References</div>
        <p>Welcome to your fifth spreadsheet lesson! Today, you'll learn about:</p>
        <ul>
            <li><strong>Delay Equations</strong> - Mathematical models where changes depend on past values</li>
            <li><strong>Advanced Cell Referencing</strong> - How to use relative references to implement time delays</li>
        </ul>
        <p>Unlike the models in previous lessons, delay equations have "memory" - the current change depends not just on the current state, but on the state of the system at previous time points.</p>
        <p>You'll implement the following delay change equation:</p>
        <p style="text-align: center; font-size: 1.2em;"><strong>ΔX / Δt = 100 - 0.5 X(t - 1)</strong></p>
        <p>Where X(t - 1) refers to the value of X at the previous time step.</p>
        <p>Delay equations are particularly interesting because they can produce oscillations and complex behavior even with very simple mathematical rules. They're widely used to model:</p>
        <ul>
            <li>Population cycles in ecosystems</li>
            <li>Economic boom-bust cycles</li>
            <li>Control systems with feedback delays</li>
            <li>Physiological processes like heart rhythm</li>
        </ul>
        <p>Building on your knowledge from previous lessons, you'll see how spreadsheet cell referencing naturally maps to the concept of a time delay.</p>
        <p>Click "Start Exercises" below to begin!</p>
    `;

    // Use the global updateInstructions function from guide.js
    window.updateInstructions(introduction);

    // Update button text
    const practiceButton = document.getElementById('practiceButton');
    if (practiceButton) {
        practiceButton.textContent = 'Start Exercises';
        practiceButton.style.display = 'block';
    }
}

// Set up the practice button for this lesson
function setupPracticeButton() {
    practiceButton = document.getElementById('practiceButton');

    if (practiceButton) {
        // Remove any existing event listeners by cloning and replacing
        const newButton = practiceButton.cloneNode(true);
        practiceButton.parentNode.replaceChild(newButton, practiceButton);
        practiceButton = newButton;

        practiceButton.addEventListener('click', handlePracticeButtonClick);
    }
}

// Handle practice button clicks
function handlePracticeButtonClick() {
    // Get current button state
    const buttonState = practiceButton.textContent;

    if (buttonState === 'Start Exercises') {
        // Start the first exercise
        currentExerciseIndex = 0;
        showExercise(currentExerciseIndex);
        practiceButton.textContent = 'Check Answer';
    }
    else if (buttonState === 'Check Answer') {
        // Check the current exercise
        const currentExercise = lesson5Exercises[currentExerciseIndex];

        if (currentExercise.validate()) {
            // Show success message - use custom success message if available
            if (currentExercise.getSuccessMessage) {
                window.showFeedback(currentExercise.getSuccessMessage(), 'success');
            } else {
                window.showFeedback('Correct! Great job!', 'success');
            }

            // Move to next exercise
            currentExerciseIndex++;

            // Change button text to continue
            if (currentExerciseIndex < lesson5Exercises.length) {
                practiceButton.textContent = 'Continue';
            } else {
                // Final exercise completed
                practiceButton.textContent = 'Finish';
            }
        } else {
            // Show error message - use custom error message if available
            if (currentExercise.getErrorMessage) {
                window.showFeedback(currentExercise.getErrorMessage(), 'error');
            } else {
                window.showFeedback('Not quite right. Please try again.', 'error');
            }
        }
    }
    else if (buttonState === 'Continue') {
        // Show next exercise
        if (currentExerciseIndex < lesson5Exercises.length) {
            showExercise(currentExerciseIndex);
            practiceButton.textContent = 'Check Answer';
        } else {
            // All exercises completed
            practiceButton.textContent = 'Finish';
        }
    }
    else if (buttonState === 'Finish') {
        // Return to main interface since this is the last lesson
        showHelpInstructions();
    }
}

// Show a specific exercise
function showExercise(index) {
    if (index < 0 || index >= lesson5Exercises.length) {
        console.error(`Exercise index ${index} is out of range`);
        return;
    }

    const exercise = lesson5Exercises[index];
    let content = exercise.instruction;

    // Check if instruction is a function (for dynamic content)
    if (typeof content === 'function') {
        content = content();
    }

    window.updateInstructions(content, exercise.title);

    // Clear feedback area
    document.getElementById('feedbackArea').innerHTML = '';
}
