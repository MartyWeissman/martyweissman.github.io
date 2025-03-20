// Lesson 3: Modeling Change Equations
// Implementation of the "change equation" Delta X / Delta t = 60 - 1.5X using spreadsheets

// Store student name when it's entered
let studentName = "student";

// Define the lesson exercises
const lesson3Exercises = [
    {
        title: "Exercise 3.1: Setting Up the Model",
        instruction:
            `<p>In this lesson, we'll use spreadsheets to study a <strong>change equation</strong>, which describes how a quantity changes over time.</p>
            <p>The equation we'll work with is: <strong>ΔX / Δt = 60 - 1.5X</strong></p>
            <p>This equation tells us that the rate of change of X depends on the current value of X. This type of equation appears in many natural processes like population growth, chemical reactions, and heat transfer.</p>
            <p>Let's begin by setting up our spreadsheet:</p>
            <ol>
                <li>Enter "Time (t)" in cell A1 as the header for our time column</li>
                <li>Enter "X" in cell B1 as the header for our variable X</li>
                <li>Enter "Delta t" in cell C1 (this will track the time step)</li>
                <li>Enter "Delta X" in cell D1 (this will track the change in X)</li>
                <li>Enter your name in cell E1 (this will be used for your verification code)</li>
            </ol>
            <p>Click "Check Answer" when you're ready to proceed.</p>`,
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
            return `Great job, ${studentName}! You've set up the headers for our change equation model.
            <p>The equation we're studying (ΔX / Δt = 60 - 1.5X) is a simple first-order change equation that shows up in many applications:</p>
            <ul>
                <li>Population growth with limiting factors</li>
                <li>Chemical reactions approaching equilibrium</li>
                <li>Objects warming or cooling to match their environment</li>
            </ul>
            <p>In the next steps, we'll implement this equation in our spreadsheet to see how X changes over time.</p>`;
        }
    },
    {
        title: "Exercise 3.2: Initial Conditions",
        instruction: function() {
            return `
                <p>Now, ${studentName}, let's set up our initial conditions and time step:</p>
                <ol>
                    <li>In cell A2, enter <strong>0</strong> (this is our starting time t=0)</li>
                    <li>In cell B2, enter <strong>10</strong> (this is our initial value of X)</li>
                    <li>In cell C2, enter <strong>1</strong> (this will be our time step Δt)</li>
                </ol>
                <p>For our equation ΔX / Δt = 60 - 1.5X, we'll use a constant time step of Δt = 1 throughout our model. Using a consistent time step makes the calculations more straightforward.</p>
                <p>Click "Check Answer" when you've entered these initial values.</p>
            `;
        },
        validate: function() {
            // Check initial values
            const timeInit = getCellData('A2');
            const xInit = getCellData('B2');
            const dtInit = getCellData('C2');

            return timeInit.type === 'number' &&
                   timeInit.result === 0 &&
                   xInit.type === 'number' &&
                   xInit.result === 10 &&
                   dtInit.type === 'number' &&
                   dtInit.result === 1;
        },
        getErrorMessage: function() {
            const timeInit = getCellData('A2');
            const xInit = getCellData('B2');
            const dtInit = getCellData('C2');

            if (timeInit.type !== 'number' || timeInit.result !== 0) {
                return "Please enter 0 as a number in cell A2 for the initial time.";
            }

            if (xInit.type !== 'number' || xInit.result !== 10) {
                return "Please enter 10 as a number in cell B2 for the initial value of X.";
            }

            if (dtInit.type !== 'number' || dtInit.result !== 1) {
                return "Please enter 1 as a number in cell C2 for the time step Δt.";
            }

            return "Please check all initial values and try again.";
        },
        getSuccessMessage: function() {
            return `Excellent work, ${studentName}! You've set up the initial conditions for our model:
            <ul>
                <li>Initial time (t) = 0</li>
                <li>Initial value of X = 10</li>
                <li>Time step (Δt) = 1</li>
            </ul>
            <p>These values will be the starting point for our calculation. In the next step, we'll create formulas to update the time and X values as we step through the model.</p>`;
        }
    },
    {
        title: "Exercise 3.3: Creating the Time and X Update Formulas",
        instruction: function() {
            return `
                <p>${studentName}, now we'll create formulas to update our time and X values:</p>
                <ol>
                    <li>In cell A3, enter the formula <strong>=A2+C2</strong> (this adds Δt to the previous time)</li>
                    <li>In cell B3, enter the formula <strong>=B2+D2</strong> (this adds ΔX to the previous X value)</li>
                </ol>
                <p>The formula in A3 computes the new time by adding the time step (Δt) to the previous time.</p>
                <p>The formula in B3 computes the new X value by adding the change in X (ΔX) to the previous X value.</p>
                <p><strong>Note:</strong> You'll see an error in cell B3 because we haven't defined ΔX yet. That's expected at this stage!</p>
                <p>Click "Check Answer" when you've created these formulas.</p>
            `;
        },
        validate: function() {
            // Check update formulas
            const timeUpdate = getCellData('A3');
            const xUpdate = getCellData('B3');

            return timeUpdate.type === 'formula' &&
                   timeUpdate.formula.toLowerCase().replace(/\s+/g, '') === '=a2+c2' &&
                   timeUpdate.result === 1 &&
                   xUpdate.type === 'formula' &&
                   xUpdate.formula.toLowerCase().replace(/\s+/g, '') === '=b2+d2';
        },
        getErrorMessage: function() {
            const timeUpdate = getCellData('A3');
            const xUpdate = getCellData('B3');

            if (timeUpdate.type !== 'formula') {
                return "Cell A3 should contain a formula. Make sure to start with an equals sign (=).";
            }

            if (timeUpdate.formula.toLowerCase().replace(/\s+/g, '') !== '=a2+c2') {
                return "Please use the formula =A2+C2 in cell A3 to add the time step to the previous time.";
            }

            if (timeUpdate.result !== 1) {
                return "The time formula isn't calculating correctly. Check that cells A2 and C2 contain the correct values.";
            }

            if (xUpdate.type !== 'formula') {
                return "Cell B3 should contain a formula. Make sure to start with an equals sign (=).";
            }

            if (xUpdate.formula.toLowerCase().replace(/\s+/g, '') !== '=b2+d2') {
                return "Please use the formula =B2+D2 in cell B3 to add ΔX to the previous X value.";
            }

            return "Please check both formulas and try again.";
        },
        getSuccessMessage: function() {
            return `Well done, ${studentName}! You've created the update formulas for time and X:
            <ul>
                <li>The time update formula (=A2+C2) adds the time step to the previous time</li>
                <li>The X update formula (=B2+D2) adds the change in X to the previous X value</li>
            </ul>
            <p>Currently, cell B3 shows an error because we haven't defined the change in X (ΔX) yet. We'll fix that in the next step by implementing our change equation.</p>`;
        }
    },
    {
        title: "Exercise 3.4: Implementing the Change Equation",
        instruction: function() {
            return `
                <p>Now, ${studentName}, we need to implement our change equation:</p>
                <p><strong>ΔX / Δt = 60 - 1.5X</strong></p>
                <p>Since Δt = 1, we can rearrange this to: <strong>ΔX = 60 - 1.5X</strong></p>
                <p>Your task:</p>
                <ol>
                    <li>In cell D2, enter a formula that implements this equation</li>
                </ol>
                <p>Think about how to translate the mathematical equation into a spreadsheet formula that references the current value of X.</p>
                <p>After entering the correct formula, the error in cell B3 should be resolved, and you should see the X value change based on the initial conditions.</p>
                <p>Click "Check Answer" when you've implemented the equation.</p>
            `;
        },
        validate: function() {
            // Check differential equation implementation
            const dxFormula = getCellData('D2');
            const xNextValue = getCellData('B3');

            return dxFormula.type === 'formula' &&
                   Math.abs(dxFormula.result - 45) < 0.01 &&
                   Math.abs(xNextValue.result - 55) < 0.01;
        },
        getErrorMessage: function() {
            const dxFormula = getCellData('D2');
            const xNextValue = getCellData('B3');

            if (dxFormula.type !== 'formula') {
                return "Cell D2 should contain a formula. Make sure to start with an equals sign (=).";
            }

            if (Math.abs(dxFormula.result - 45) >= 0.01) {
                return "Your formula isn't calculating ΔX correctly. The result should be 45 for X = 10.";
            }

            if (Math.abs(xNextValue.result - 55) >= 0.01) {
                return "Cell B3 should show 55 (10+45). Check that your formulas are working together correctly.";
            }

            return "Please check your change equation implementation and try again.";
        },
        getSuccessMessage: function() {
            return `Perfect, ${studentName}! You've successfully implemented the change equation:
            <ul>
                <li>Original equation: ΔX / Δt = 60 - 1.5X</li>
                <li>Since Δt = 1, simplified to: ΔX = 60 - 1.5X</li>
                <li>You've correctly translated this into a spreadsheet formula</li>
            </ul>
            <p>You can see the equation in action:</p>
            <ul>
                <li>Initial X = 10</li>
                <li>Initial ΔX = 60 - 1.5*10 = 45</li>
                <li>Next X = 10 + 45 = 55</li>
            </ul>
            <p>In the final step, we'll extend this model to see how X evolves over multiple time steps.</p>`;
        }
    },
    {
        title: "Exercise 3.5: Extending the Model",
        instruction: function() {
            return `
                <p>Let's extend our model to see how X evolves over time, ${studentName}. This basic spreadsheet requires us to copy and paste one column at a time:</p>
                <ol>
                    <li><strong>First, extend the Delta t column:</strong></li>
                    <li>Click on cell C2 to select it</li>
                    <li>Copy it (Ctrl+C or Command+C)</li>
                    <li>Click on cell C3</li>
                    <li>Paste (Ctrl+V or Command+V)</li>
                    <li>Click on cell C4 and paste again</li>
                    <li>Continue pasting down to cell C8</li>

                    <li><strong>Next, extend the time column:</strong></li>
                    <li>Copy and paste the formula in cell A3 down to cell A8</li>

                    <li><strong>Next, extend the X column:</strong></li>
                    <li>Copy and paste the formula in cell B3 down to cell B8</li>
                    <li>You'll see error values because we haven't defined Delta X values yet</li>

                    <li><strong>Finally, extend the Delta X column:</strong></li>
                    <li>Copy and paste the formula in cell D2 down to cell D8</li>
                    <li>This should resolve the errors in the X column</li>
                </ol>
                <p>This will create 6 more time steps in our model. The formulas will automatically adjust to reference the correct cells in each row, thanks to relative references.</p>
                <p>Observe how X changes over time in your spreadsheet as the model calculates multiple steps.</p>
                <p>Click "Check Answer" when you've extended the model through row 8.</p>
            `;
        },
        validate: function() {
            // Check that the model has been extended correctly
            // Just check rows 7 and 8 to verify the model was extended properly
            const time7 = getCellData('A7');
            const time8 = getCellData('A8');

            const x7 = getCellData('B7');
            const x8 = getCellData('B8');

            const dt7 = getCellData('C7');
            const dt8 = getCellData('C8');

            const dx7 = getCellData('D7');
            const dx8 = getCellData('D8');

            // Check that all cells contain formulas (except dt which should be constant 1)
            const allFormulas =
                time7.type === 'formula' &&
                time8.type === 'formula' &&
                x7.type === 'formula' &&
                x8.type === 'formula' &&
                dx7.type === 'formula' &&
                dx8.type === 'formula';

            // Time values should be sequential
            const correctTimeValues =
                Math.abs(time7.result - 5) < 0.01 &&
                Math.abs(time8.result - 6) < 0.01;

            // Delta t should all be 1
            const correctDt =
                Math.abs(dt7.result - 1) < 0.01 &&
                Math.abs(dt8.result - 1) < 0.01;

            // X should be approaching 40 by row 8
            const approachingEquilibrium =
                x8.result > 39 && x8.result < 40.5;

            return allFormulas && correctTimeValues && correctDt && approachingEquilibrium;
        },
        getErrorMessage: function() {
            // Check specific cells to provide better error messages
            const time8 = getCellData('A8');
            const x8 = getCellData('B8');
            const dt8 = getCellData('C8');
            const dx8 = getCellData('D8');

            if (time8.type !== 'formula' || Math.abs(time8.result - 6) >= 0.01) {
                return "Make sure you've copied the time formula down through row 8. Cell A8 should show time = 6.";
            }

            if (x8.type !== 'formula') {
                return "Make sure you've copied the X formula down through row 8.";
            }

            if (Math.abs(dt8.result - 1) >= 0.01) {
                return "Make sure you've copied the Delta t value down through row 8. All Delta t values should be 1.";
            }

            if (dx8.type !== 'formula') {
                return "Make sure you've copied the Delta X formula down through row 8.";
            }

            if (x8.result < 39) {
                return "The X value in row 8 is too low. X should be approaching 40 by this point. Check your formulas.";
            }

            return "Please check that you've copied all formulas through row 8 correctly. Remember to copy each column separately.";
        },
        getSuccessMessage: function() {
            // Generate verification code
            let verificationCode = "XXXXX";
            if (typeof window.makeVerification === 'function') {
                verificationCode = window.makeVerification(studentName, 3);
            }

            return `Excellent work, ${studentName}! You've successfully modeled the change equation through multiple time steps.

            <p>Looking at your model, you can observe that:</p>
            <ul>
                <li>X starts at 10</li>
                <li>After several time steps, X approaches 40</li>
                <li>The changes (ΔX) get smaller as X approaches 40</li>
            </ul>

            <p>This is a fundamental property of this type of change equation. The value 40 is called the <strong>equilibrium point</strong> because:</p>
            <ul>
                <li>When X = 40, ΔX = 60 - 1.5*40 = 0</li>
                <li>When X < 40, ΔX is positive, so X increases</li>
                <li>When X > 40, ΔX is negative, so X decreases</li>
            </ul>

            <p>This simple model demonstrates many important concepts in dynamical systems and is similar to models used in population dynamics, chemical kinetics, and other scientific fields.</p>

            <p><strong>Your verification code for Lesson 3 is: ${verificationCode}</strong></p>
            <p>Please provide this code to your instructor to verify completion of this lesson.</p>

            <p>Congratulations on completing this introduction to change equations in spreadsheets!</p>`;
        }
    }
];

let currentExerciseIndex = 0;
let practiceButton;

// Initialize the lesson - function must be globally available
function initLesson() {
    console.log("Initializing Lesson 3");

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
        <div class="instruction-title">Lesson 3: Modeling Change Equations</div>
        <p>Welcome to your third spreadsheet lesson! In this lesson, you'll apply your spreadsheet skills to model a mathematical concept: change equations.</p>
        <p>Change equations describe how quantities change over time and are fundamental to many scientific fields, including:</p>
        <ul>
            <li>Physics (motion, oscillations, thermodynamics)</li>
            <li>Biology (population growth, epidemiology)</li>
            <li>Chemistry (reaction rates, equilibrium)</li>
            <li>Economics (compound interest, market models)</li>
        </ul>
        <p>We'll start with a simple first-order change equation:</p>
        <p style="text-align: center; font-size: 1.2em;"><strong>ΔX / Δt = 60 - 1.5X</strong></p>
        <p>You'll create a spreadsheet that:</p>
        <ul>
            <li>Implements this equation step by step</li>
            <li>Tracks how X changes over time</li>
            <li>Shows how X approaches its equilibrium value</li>
        </ul>
        <p>By the end of this lesson, you'll understand how to use spreadsheets as a powerful tool for numerical simulation and scientific modeling.</p>
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
        const currentExercise = lesson3Exercises[currentExerciseIndex];

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
            if (currentExerciseIndex < lesson3Exercises.length) {
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
        if (currentExerciseIndex < lesson3Exercises.length) {
            showExercise(currentExerciseIndex);
            practiceButton.textContent = 'Check Answer';
        } else {
            // All exercises completed
            practiceButton.textContent = 'Next Lesson';
        }
    }
    else if (buttonState === 'Next Lesson') {
        // Load the next lesson (Lesson 4)
        const lessonButtons = document.querySelectorAll('.lesson-button');
        if (lessonButtons.length >= 4) {
            lessonButtons[3].click();  // Click Lesson 4 button
        }
    }
}

// Show a specific exercise
function showExercise(index) {
    if (index < 0 || index >= lesson3Exercises.length) {
        console.error(`Exercise index ${index} is out of range`);
        return;
    }

    const exercise = lesson3Exercises[index];
    let content = exercise.instruction;

    // Check if instruction is a function (for dynamic content)
    if (typeof content === 'function') {
        content = content();
    }

    window.updateInstructions(content, exercise.title);

    // Clear feedback area
    document.getElementById('feedbackArea').innerHTML = '';
}
