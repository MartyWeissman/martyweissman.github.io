// Lesson 4: Absolute References and the Logistic Model
// Implementation of the discrete logistic model Delta P / Delta t = b P (1 - P)

// Store student name when it's entered
let studentName = "student";

// Define the lesson exercises
const lesson4Exercises = [
    {
        title: "Exercise 4.1: Setting Up the Logistic Model",
        instruction:
            `<p>In this lesson, we'll explore <strong>absolute cell references</strong> while modeling a fascinating mathematical concept: the <strong>discrete logistic model</strong>.</p>
            <p>The equation we'll work with is: <strong>ΔP / Δt = b P (1 - P)</strong></p>
            <p>This is a fundamental model in population dynamics, where:</p>
            <ul>
                <li>P represents population as a fraction of the maximum possible population</li>
                <li>b is the birth rate parameter that controls the system's behavior</li>
                <li>The term (1 - P) represents environmental constraints on growth</li>
            </ul>
            <p>Let's set up our spreadsheet:</p>
            <ol>
                <li>Enter "Time (t)" in cell A1 as the header for our time column</li>
                <li>Enter "P" in cell B1 as the header for our population variable</li>
                <li>Enter "Delta t" in cell C1 (this will track the time step)</li>
                <li>Enter "Delta P" in cell D1 (this will track the change in population)</li>
                <li>Enter your name in cell E1 (this will be used for your verification code)</li>
            </ol>
            <p>Click "Check Answer" when you've set up the headers.</p>`,
        validate: function() {
            // Check if headers are correct
            const timeHeader = getCellData('A1');
            const pHeader = getCellData('B1');
            const dtHeader = getCellData('C1');
            const dpHeader = getCellData('D1');
            const nameCell = getCellData('E1');

            // Store the student's name for later use
            if (nameCell.type === 'text' && nameCell.value.trim() !== '') {
                studentName = nameCell.value.trim();
            }

            return timeHeader.type === 'text' &&
                   timeHeader.value.toLowerCase().includes('time') &&
                   pHeader.type === 'text' &&
                   pHeader.value.toLowerCase().includes('p') &&
                   dtHeader.type === 'text' &&
                   dtHeader.value.toLowerCase().includes('delta t') &&
                   dpHeader.type === 'text' &&
                   dpHeader.value.toLowerCase().includes('delta p') &&
                   nameCell.type === 'text' &&
                   nameCell.value.trim() !== '';
        },
        getErrorMessage: function() {
            // Detailed error messages
            const timeHeader = getCellData('A1');
            const pHeader = getCellData('B1');
            const dtHeader = getCellData('C1');
            const dpHeader = getCellData('D1');
            const nameCell = getCellData('E1');

            if (timeHeader.type !== 'text' || !timeHeader.value.toLowerCase().includes('time')) {
                return "Please enter 'Time (t)' as text in cell A1.";
            }

            if (pHeader.type !== 'text' || !pHeader.value.toLowerCase().includes('p')) {
                return "Please enter 'P' as text in cell B1.";
            }

            if (dtHeader.type !== 'text' || !dtHeader.value.toLowerCase().includes('delta t')) {
                return "Please enter 'Delta t' as text in cell C1.";
            }

            if (dpHeader.type !== 'text' || !dpHeader.value.toLowerCase().includes('delta p')) {
                return "Please enter 'Delta P' as text in cell D1.";
            }

            if (nameCell.type !== 'text' || nameCell.value.trim() === '') {
                return "Please enter your name in cell E1.";
            }

            return "Please check all header cells and try again.";
        },
        getSuccessMessage: function() {
            return `Great job, ${studentName}! You've set up the headers for our logistic model.
            <p>The discrete logistic model is one of the most famous and important models in population biology. Despite its simple form, it can produce remarkably complex behavior:</p>
            <ul>
                <li>At low birth rates, populations stabilize at a fixed value</li>
                <li>At higher birth rates, populations can oscillate between multiple values</li>
                <li>At very high birth rates, the system can become chaotic</li>
            </ul>
            <p>This model demonstrates how even simple rules can generate complex behavior—an important concept in the study of dynamical systems.</p>`;
        }
    },
    {
        title: "Exercise 4.2: Setting Initial Conditions and Parameters",
        instruction: function() {
            return `
                <p>Now, ${studentName}, let's set up our initial conditions and parameter:</p>
                <ol>
                    <li>Set the initial time to 0</li>
                    <li>Set the initial population P to 0.1 (10% of the maximum possible population)</li>
                    <li>Set the time step Δt to 1</li>
                    <li>Change cell E1 from your name to "Birth rate (b)"</li>
                    <li>In cell E2, enter 2.2 as our birth rate parameter</li>
                </ol>
                <p>The birth rate parameter b = 2.2 will be used in our change equation ΔP/Δt = b P (1-P).</p>
                <p>Click "Check Answer" when you've entered these values.</p>
            `;
        },
        validate: function() {
            // Check initial values and parameter
            const timeInit = getCellData('A2');
            const pInit = getCellData('B2');
            const dtInit = getCellData('C2');
            const bHeader = getCellData('E1');
            const bValue = getCellData('E2');

            return timeInit.type === 'number' &&
                   timeInit.result === 0 &&
                   pInit.type === 'number' &&
                   Math.abs(pInit.result - 0.1) < 0.001 &&
                   dtInit.type === 'number' &&
                   dtInit.result === 1 &&
                   bHeader.type === 'text' &&
                   bHeader.value.toLowerCase().includes('birth') &&
                   bHeader.value.toLowerCase().includes('b') &&
                   bValue.type === 'number' &&
                   Math.abs(bValue.result - 2.2) < 0.001;
        },
        getErrorMessage: function() {
            const timeInit = getCellData('A2');
            const pInit = getCellData('B2');
            const dtInit = getCellData('C2');
            const bHeader = getCellData('E1');
            const bValue = getCellData('E2');

            if (timeInit.type !== 'number' || timeInit.result !== 0) {
                return "Please enter 0 as a number in cell A2 for the initial time.";
            }

            if (pInit.type !== 'number' || Math.abs(pInit.result - 0.1) >= 0.001) {
                return "Please enter 0.1 as a number in cell B2 for the initial population P.";
            }

            if (dtInit.type !== 'number' || dtInit.result !== 1) {
                return "Please enter 1 as a number in cell C2 for the time step Δt.";
            }

            if (bHeader.type !== 'text' || !bHeader.value.toLowerCase().includes('birth') || !bHeader.value.toLowerCase().includes('b')) {
                return "Please change cell E1 to 'Birth rate (b)'.";
            }

            if (bValue.type !== 'number' || Math.abs(bValue.result - 2.2) >= 0.001) {
                return "Please enter 2.2 as a number in cell E2 for the birth rate parameter.";
            }

            return "Please check all values and try again.";
        },
        getSuccessMessage: function() {
            return `Excellent work, ${studentName}! You've set up the initial conditions for our model:
            <ul>
                <li>Initial time (t) = 0</li>
                <li>Initial population (P) = 0.1</li>
                <li>Time step (Δt) = 1</li>
                <li>Birth rate parameter (b) = 2.2</li>
            </ul>
            <p>We've chosen a birth rate of 2.2, which will produce interesting dynamics as we iterate the model. In the next steps, we'll create formulas to update time and population values.</p>`;
        }
    },
    {
        title: "Exercise 4.3: Creating Update Formulas",
        instruction: function() {
            return `
                <p>${studentName}, now let's set up our time and population update formulas:</p>
                <ol>
                    <li>In cell A3, enter a formula to add Δt to the previous time</li>
                    <li>In cell B3, enter a formula to add ΔP to the previous population</li>
                    <li>In cell D2, enter a formula that implements our change equation:</li>
                </ol>
                <p>For cell D2, implement <strong>ΔP = b P (1-P)</strong> where:</p>
                <ul>
                    <li>b is the birth rate parameter in cell E2</li>
                    <li>P is the population in cell B2</li>
                </ul>
                <p>Be sure to reference the cells containing these values in your formula.</p>
                <p>Click "Check Answer" when you've created these formulas.</p>
            `;
        },
        validate: function() {
            // Check update formulas
            const timeUpdate = getCellData('A3');
            const pUpdate = getCellData('B3');
            const dpFormula = getCellData('D2');

            // Is the time formula correct?
            const timeFormulaCorrect = timeUpdate.type === 'formula' &&
                                       timeUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('a2+c2') &&
                                       timeUpdate.result === 1;

            // Is the population update formula correct?
            const pFormulaCorrect = pUpdate.type === 'formula' &&
                                    pUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('b2+d2');

            // Is the Delta P formula correctly implementing the logistic model?
            // We allow various ways to write the formula
            const dpFormulaCorrect = dpFormula.type === 'formula' &&
                                     (
                                         // These are various valid ways to write the formula
                                         dpFormula.formula.toLowerCase().replace(/\s+/g, '').includes('e2*b2*(1-b2)') ||
                                         dpFormula.formula.toLowerCase().replace(/\s+/g, '').includes('e2*b2*(1-b2)') ||
                                         dpFormula.formula.toLowerCase().replace(/\s+/g, '').includes('e2*b2-e2*b2*b2') ||
                                         dpFormula.formula.toLowerCase().replace(/\s+/g, '').includes('e2*b2-e2*b2^2')
                                     ) &&
                                     Math.abs(dpFormula.result - 0.198) < 0.001; // b*P*(1-P) = 2.2*0.1*(1-0.1) = 0.198

            return timeFormulaCorrect && pFormulaCorrect && dpFormulaCorrect;
        },
        getErrorMessage: function() {
            const timeUpdate = getCellData('A3');
            const pUpdate = getCellData('B3');
            const dpFormula = getCellData('D2');

            if (timeUpdate.type !== 'formula') {
                return "Cell A3 should contain a formula to update the time. Try =A2+C2";
            }

            if (!timeUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('a2+c2')) {
                return "The formula in cell A3 should add the time step to the previous time (=A2+C2).";
            }

            if (timeUpdate.result !== 1) {
                return "The time formula isn't calculating correctly. Check that cells A2 and C2 contain the correct values.";
            }

            if (pUpdate.type !== 'formula') {
                return "Cell B3 should contain a formula to update the population. Try =B2+D2";
            }

            if (!pUpdate.formula.toLowerCase().replace(/\s+/g, '').includes('b2+d2')) {
                return "The formula in cell B3 should add ΔP to the previous population (=B2+D2).";
            }

            if (dpFormula.type !== 'formula') {
                return "Cell D2 should contain a formula implementing ΔP = b P (1-P). Use cells E2 and B2 in your formula.";
            }

            if (Math.abs(dpFormula.result - 0.198) >= 0.001) {
                return "The ΔP calculation isn't correct. For b=2.2 and P=0.1, ΔP should be approximately 0.198.";
            }

            return "Please check your formulas and try again.";
        },
        getSuccessMessage: function() {
            return `Well done, ${studentName}! You've correctly set up the logistic model:
            <ul>
                <li>Time update: from t to t+Δt</li>
                <li>Population update: from P to P+ΔP</li>
                <li>Change equation: ΔP = b P (1-P)</li>
            </ul>
            <p>Your formula in D2 multiplies the birth rate parameter (b) by the current population (P) and by the remaining capacity factor (1-P). This captures the essence of the logistic model:</p>
            <ul>
                <li>When P is small, growth is approximately exponential (≈ b×P)</li>
                <li>As P approaches 1, the growth rate decreases (due to the 1-P factor)</li>
                <li>If P were to exceed 1, growth would become negative (population decline)</li>
            </ul>
            <p>Next, we'll extend the model to see how population evolves over time.</p>`;
        }
    },
    {
        title: "Exercise 4.4: Extending the Model - First Attempt",
        instruction: function() {
            return `
                <p>Let's extend our model to row 3, ${studentName}. Since you're familiar with the process from previous lessons, try copying and pasting the necessary cells to complete row 3:</p>
                <ol>
                    <li>Ensure that the time in cell A3 increases by 1 (should be t=1)</li>
                    <li>Ensure that cell B3 updates the population based on the change (should be approx. 0.298)</li>
                    <li>Ensure that cell C3 contains the time step (Δt=1)</li>
                    <li>Copy the formula from cell D2 to cell D3 to calculate the next change</li>
                </ol>
                <p><strong>Note:</strong> Do not add any values to column E beyond what you already have in E1 and E2.</p>
                <p>Click "Check Answer" after completing row 3.</p>
            `;
        },
        validate: function() {
            // Check that row 3 is set up correctly
            const time3 = getCellData('A3');
            const p3 = getCellData('B3');
            const dt3 = getCellData('C3');
            const dp3 = getCellData('D3');

            // Check time value is correct
            const timeCorrect = time3.type === 'formula' &&
                               time3.result === 1;

            // Check P value is correct
            const pCorrect = p3.type === 'formula' &&
                            Math.abs(p3.result - 0.298) < 0.001;

            // Check Δt value is correct
            const dtCorrect = dt3.type === 'number' &&
                             dt3.result === 1;

            // Check if there's an error in the ΔP formula
            // We expect this to fail because of the missing E3 reference
            const dpError = dp3.type === 'formula' &&
                           (dp3.result === '#ERROR' || dp3.result === undefined || dp3.result === null);

            return timeCorrect && pCorrect && dtCorrect && dpError;
        },
        getErrorMessage: function() {
            const time3 = getCellData('A3');
            const p3 = getCellData('B3');
            const dt3 = getCellData('C3');
            const dp3 = getCellData('D3');

            if (time3.type !== 'formula' || time3.result !== 1) {
                return "Make sure cell A3 contains a formula that correctly calculates time = 1.";
            }

            if (p3.type !== 'formula' || Math.abs(p3.result - 0.298) >= 0.01) {
                return "Make sure cell B3 contains a formula that correctly updates the population to approximately 0.298.";
            }

            if (dt3.result !== 1) {
                return "Make sure cell C3 contains the time step Δt = 1.";
            }

            if (dp3.type !== 'formula') {
                return "Make sure you've copied the formula from cell D2 to cell D3.";
            }

            if (dp3.result !== '#ERROR' && dp3.result !== undefined && dp3.result !== null) {
                return "You should be seeing an error in cell D3. This is expected and we'll fix it in the next step.";
            }

            return "Something's not quite right. Please check all your formulas in row 3.";
        },
        getSuccessMessage: function() {
            return `Great job, ${studentName}! You've extended the model to row 3, but encountered an issue.
            <p>Notice that cell D3 shows an error. This happens because the formula in D2 references cell E2 (the birth rate), and when you copied this formula to D3, it became a reference to cell E3, which is empty.</p>
            <p>This illustrates a key limitation of relative cell references: when you copy a formula, all cell references shift relative to the new location.</p>
            <p>In the next step, we'll solve this problem using <strong>absolute cell references</strong>!</p>`;
        }
    },
    {
        title: "Exercise 4.5: Using Absolute References",
        instruction: function() {
            return `
                <p>${studentName}, we've encountered a fundamental spreadsheet concept: the difference between <strong>relative</strong> and <strong>absolute</strong> cell references.</p>
                <p><strong>Relative references</strong> (like E2) change when copied to a new location. When copied from D2 to D3, E2 becomes E3.</p>
                <p><strong>Absolute references</strong> (like $E$2) don't change when copied. The $ signs "lock" the row and column.</p>
                <p>Let's fix our model:</p>
                <ol>
                    <li>Change the formula in cell D2 to: <strong>=$E$2*B2*(1-B2)</strong></li>
                    <li>Copy this formula and paste it into cells D3 through D8</li>
                </ol>
                <p>This way, all rows will reference the same birth rate parameter in cell E2.</p>
                <p>Now extend the model through row 8 by copying appropriate cells:</p>
                <ol>
                    <li>Copy and paste the time formula through A8</li>
                    <li>Copy and paste the population formula through B8</li>
                    <li>Copy and paste the time step (1) through C8</li>
                </ol>
                <p>Click "Check Answer" when you've completed the model through row 8.</p>
            `;
        },
        validate: function() {
            // Check that the model is now correctly extended through row 8
            const time8 = getCellData('A8');
            const p8 = getCellData('B8');
            const dt8 = getCellData('C8');
            const dp2 = getCellData('D2');
            const dp8 = getCellData('D8');

            // Check time value is correct
            const timeCorrect = time8.type === 'formula' &&
                               time8.result === 6;

            // Check Δt value is correct
            const dtCorrect = dt8.result === 1;

            // Check that D2 uses absolute reference
            const absoluteRefCorrect = dp2.type === 'formula' &&
                                      dp2.formula.includes('$E$2');

            // Check that cells D3-D8 have valid values (no errors)
            const dpCorrect = dp8.type === 'formula' &&
                             !isNaN(dp8.result) &&
                             dp8.result !== '#ERROR' &&
                             dp8.result !== undefined &&
                             dp8.result !== null;

            return timeCorrect && dtCorrect && absoluteRefCorrect && dpCorrect;
        },
        getErrorMessage: function() {
            const time8 = getCellData('A8');
            const p8 = getCellData('B8');
            const dt8 = getCellData('C8');
            const dp2 = getCellData('D2');
            const dp8 = getCellData('D8');

            if (dp2.type !== 'formula' || !dp2.formula.includes('$E$2')) {
                return "The formula in cell D2 should use an absolute reference like $E$2 to refer to the birth rate parameter.";
            }

            if (time8.type !== 'formula' || time8.result !== 6) {
                return "Make sure you've extended the time formula through row 8. Cell A8 should show time = 6.";
            }

            if (dt8.result !== 1) {
                return "Make sure you've copied the time step value (1) through cell C8.";
            }

            if (dp8.type !== 'formula' || isNaN(dp8.result) || dp8.result === '#ERROR' || dp8.result === undefined || dp8.result === null) {
                return "There's still an issue with the Delta P formulas. Make sure cell D2 uses $E$2 (with dollar signs) and that you've copied this formula through cell D8.";
            }

            if (p8.type !== 'formula') {
                return "Make sure you've extended the population formula through cell B8.";
            }

            return "Something's not quite right. Check that all formulas through row 8 are working correctly.";
        },
        getSuccessMessage: function() {
            // Generate verification code
            let verificationCode = "XXXXX";
            if (typeof window.makeVerification === 'function') {
                verificationCode = window.makeVerification(studentName, 4);
            }

            return `Excellent work, ${studentName}! You've successfully used absolute references to build a working logistic model.

            <p><strong>Key concepts you've learned:</strong></p>
            <ul>
                <li><strong>Relative references</strong> (like B2) change when formulas are copied to new locations</li>
                <li><strong>Absolute references</strong> (like $E$2) stay fixed when formulas are copied</li>
                <li>You can also mix both with $E2 (fixed column) or E$2 (fixed row)</li>
            </ul>

            <p><strong>About the logistic model:</strong></p>
            <p>With b = 2.2, you should observe the population approach a stable value around 0.55. Try experimenting by changing the birth rate parameter in E2:</p>
            <ul>
                <li>When b < 3, the population stabilizes at a single value</li>
                <li>When 3 < b < 3.57, the population oscillates between multiple values</li>
                <li>When b > 3.57, the system becomes chaotic (seemingly random)</li>
            </ul>
            <p>This simple model produces remarkably complex behaviors, and is a famous example in chaos theory. To learn more, search for "logistic map" or "bifurcation diagram".</p>

            <p><strong>Your verification code for Lesson 4 is: ${verificationCode}</strong></p>
            <p>Please provide this code to your instructor to verify completion of this lesson.</p>

            <p>Congratulations on mastering absolute references and implementing a fascinating mathematical model!</p>`;
        }
    }
];

let currentExerciseIndex = 0;
let practiceButton;

// Initialize the lesson - function must be globally available
function initLesson() {
    console.log("Initializing Lesson 4");

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
        <div class="instruction-title">Lesson 4: Absolute References and the Logistic Model</div>
        <p>Welcome to your fourth spreadsheet lesson! Today, you'll learn about:</p>
        <ul>
            <li><strong>Absolute Cell References</strong> - A crucial spreadsheet technique for working with fixed values</li>
            <li><strong>The Logistic Model</strong> - A foundational model in population dynamics and chaos theory</li>
        </ul>
        <p>So far, you've used <strong>relative cell references</strong> which automatically adjust when copied to new locations. While this is usually helpful, sometimes you need references that <strong>don't change</strong> when copied.</p>
        <p>You'll implement the discrete logistic model:</p>
        <p style="text-align: center; font-size: 1.2em;"><strong>ΔP / Δt = b P (1 - P)</strong></p>
        <p>Where:</p>
        <ul>
            <li>P is the population size (as a fraction of maximum)</li>
            <li>b is the birth rate parameter</li>
            <li>The (1-P) term represents environmental constraints</li>
        </ul>
        <p>By the end of this lesson, you'll understand how and when to use absolute references, and you'll see how this simple population model can produce surprisingly complex behavior.</p>
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
        const currentExercise = lesson4Exercises[currentExerciseIndex];

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
            if (currentExerciseIndex < lesson4Exercises.length) {
                practiceButton.textContent = 'Continue';
            } else {
                // Final exercise completed
                practiceButton.textContent = 'Next Lesson';
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
        if (currentExerciseIndex < lesson4Exercises.length) {
            showExercise(currentExerciseIndex);
            practiceButton.textContent = 'Check Answer';
        } else {
            // All exercises completed
            practiceButton.textContent = 'Next Lesson';
        }
    }
    else if (buttonState === 'Next Lesson') {
        // Load the next lesson (Lesson 5)
        const lessonButtons = document.querySelectorAll('.lesson-button');
        if (lessonButtons.length >= 5) {
            lessonButtons[4].click();  // Click Lesson 5 button
        }
    }
}

// Show a specific exercise
function showExercise(index) {
    if (index < 0 || index >= lesson4Exercises.length) {
        console.error(`Exercise index ${index} is out of range`);
        return;
    }

    const exercise = lesson4Exercises[index];
    let content = exercise.instruction;

    // Check if instruction is a function (for dynamic content)
    if (typeof content === 'function') {
        content = content();
    }

    window.updateInstructions(content, exercise.title);

    // Clear feedback area
    document.getElementById('feedbackArea').innerHTML = '';
}
