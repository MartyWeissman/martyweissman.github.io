// Lesson 1: Introduction to Spreadsheets for Life Sciences
// Covers basic cell entry, formulas, and simple calculations

// Store student name when it's entered
let studentName = "student";

// Define the lesson exercises
const lesson1Exercises = [
    {
        title: "Exercise 1.1: Basic Cell Entry",
        instruction:
            `<p>Each cell is located by a letter (column) and number (row).</p>
            <p>Please write your name in cell B3 and your age in cell A7.</p>
            <p>Click the "Check Answer" button when you are done.</p>`,
        validate: function() {
            // Check if cell types are correct
            const nameCell = getCellData('B3');
            const ageCell = getCellData('A7');

            // Store the student's name for later use
            if (nameCell.type === 'text' && nameCell.value.trim() !== '') {
                studentName = nameCell.value.trim();
            }

            // Only accept proper number type for age, not text that could be parsed
            return nameCell.type === 'text' && ageCell.type === 'number';
        },
        getErrorMessage: function() {
            const nameCell = getCellData('B3');
            const ageCell = getCellData('A7');

            if (nameCell.type !== 'text') {
                return "Please make sure your name is entered as text in cell B3.";
            }

            if (ageCell.type !== 'number') {
                return "Please make sure your age is entered as a number in cell A7. If you're typing a number but it's being treated as text, make sure there are no spaces or other characters.";
            }

            return "Please check both cells and try again.";
        },
        getSuccessMessage: function() {
            const name = getCellValue('B3');
            const age = getCellValue('A7');

            // Store the student's name for later use
            studentName = name;

            return `Nice job ${name}! You are ${age} years old. Notice that textual data is highlighted in green, and numerical data is black in this spreadsheet.`;
        }
    },
    {
        title: "Exercise 1.2: Creating a Population Table",
        instruction: function() {
            // Get the user's name
            return `
                <p>${studentName}, we are going to make a little table to track the shark and tuna populations over time.</p>
                <p>Let's begin with a header row:</p>
                <ol>
                    <li>Enter "Sharks" into cell A1</li>
                    <li>Enter "Tuna" into cell B1</li>
                    <li>Enter "Total" into cell C1</li>
                </ol>
                <p>Next, enter the starting populations:</p>
                <ol start="4">
                    <li>Enter 90 for the shark population in cell A2</li>
                    <li>Enter 100 for the tuna population in cell B2</li>
                </ol>
                <p>Click the "Check Answer" button when you're done.</p>
            `;
        },
        validate: function() {
            // Check header row
            const sharksHeader = getCellData('A1');
            const tunaHeader = getCellData('B1');
            const totalHeader = getCellData('C1');

            // Check population values
            const sharksValue = getCellData('A2');
            const tunaValue = getCellData('B2');

            return sharksHeader.type === 'text' &&
                   sharksHeader.value.toLowerCase().includes('shark') &&
                   tunaHeader.type === 'text' &&
                   tunaHeader.value.toLowerCase().includes('tuna') &&
                   totalHeader.type === 'text' &&
                   totalHeader.value.toLowerCase().includes('total') &&
                   sharksValue.type === 'number' &&
                   sharksValue.result === 90 &&
                   tunaValue.type === 'number' &&
                   tunaValue.result === 100;
        },
        getErrorMessage: function() {
            // More detailed error messages to help the student
            const sharksHeader = getCellData('A1');
            const tunaHeader = getCellData('B1');
            const totalHeader = getCellData('C1');
            const sharksValue = getCellData('A2');
            const tunaValue = getCellData('B2');

            if (sharksHeader.type !== 'text' || !sharksHeader.value.toLowerCase().includes('shark')) {
                return "Please enter 'Sharks' as text in cell A1.";
            }

            if (tunaHeader.type !== 'text' || !tunaHeader.value.toLowerCase().includes('tuna')) {
                return "Please enter 'Tuna' as text in cell B1.";
            }

            if (totalHeader.type !== 'text' || !totalHeader.value.toLowerCase().includes('total')) {
                return "Please enter 'Total' as text in cell C1.";
            }

            if (sharksValue.type !== 'number' || sharksValue.result !== 90) {
                return "Please enter 90 as a number in cell A2 for the shark population.";
            }

            if (tunaValue.type !== 'number' || tunaValue.result !== 100) {
                return "Please enter 100 as a number in cell B2 for the tuna population.";
            }

            return "Please check all cells and try again.";
        },
        getSuccessMessage: function() {
            return `Great work, ${studentName}! You've created a table with headers and starting population values. Now we have 90 sharks and 100 tuna to begin our population tracking.`;
        }
    },
    {
        title: "Exercise 1.3: Creating Your First Formula",
        instruction: function() {
            return `
                <p>${studentName}, your next job is to track the total population of both species combined.</p>
                <p>For this, we'll use another type of cell called a <strong>formula</strong> cell. Formulas always begin with an equals sign (=).</p>
                <ol>
                    <li>Click on cell C2 (under the "Total" header)</li>
                    <li>Type <strong>=A2+B2</strong> into the cell</li>
                    <li>Press Enter/Return</li>
                </ol>
                <p>Observe that when you press Enter, the result is computed automatically. The cell will display 190 (90+100).</p>
                <p>Notice also that formula results are highlighted in blue in this spreadsheet, making it easy to identify calculated values.</p>
                <p>Click the "Check Answer" button when you're done.</p>
            `;
        },
        validate: function() {
            // Check if cell C2 contains the correct formula
            const totalCell = getCellData('C2');

            // Must be a formula, specifically =A2+B2, and result must be 190
            return totalCell.type === 'formula' &&
                   totalCell.formula.toLowerCase().replace(/\s+/g, '') === '=a2+b2' &&
                   totalCell.result === 190;
        },
        getErrorMessage: function() {
            const totalCell = getCellData('C2');

            if (totalCell.type !== 'formula') {
                return "Cell C2 should contain a formula. Make sure to start with an equals sign (=).";
            }

            if (totalCell.formula.toLowerCase().replace(/\s+/g, '') !== '=a2+b2') {
                return "Please use the formula =A2+B2 in cell C2 to add the shark and tuna populations.";
            }

            if (totalCell.result !== 190) {
                return "The formula isn't calculating correctly. Check that cells A2 and B2 contain the correct values (90 and 100).";
            }

            return "Something's not right with your formula. Try entering =A2+B2 in cell C2 again.";
        },
        getSuccessMessage: function() {
            return `Excellent, ${studentName}! You've created your first formula. The total population is 190, combining 90 sharks and 100 tuna. Notice how the formula result appears in blue, showing that it's calculated rather than directly entered.`;
        }
    },
    {
        title: "Exercise 1.4: Population Changes",
        instruction: function() {
            return `
                <p>${studentName}, now let's track how these populations change over time.</p>
                <p>The shark population will decrease by 10% and the tuna population will increase by 20%.</p>
                <ol>
                    <li>In cell A3, enter a formula to calculate the new shark population by multiplying A2 by 0.9</li>
                    <li>In cell B3, enter a formula to calculate the new tuna population by multiplying B2 by 1.2</li>
                    <li>In cell C3, enter a formula to calculate the new total population by adding A3 and B3</li>
                </ol>
                <p>Hint for the formulas:
                <ul>
                    <li>For cell A3: <strong>=A2*0.9</strong></li>
                    <li>For cell B3: <strong>=B2*1.2</strong></li>
                    <li>For cell C3: <strong>=A3+B3</strong></li>
                </ul>
                </p>
                <p>Click the "Check Answer" button when you're done.</p>
            `;
        },
        validate: function() {
            // Check if cells contain the correct formulas and values
            const sharkCell = getCellData('A3');
            const tunaCell = getCellData('B3');
            const totalCell = getCellData('C3');

            // Expected values
            const expectedSharkResult = 81; // 90 * 0.9
            const expectedTunaResult = 120; // 100 * 1.2
            const expectedTotalResult = 201; // 81 + 120

            // Tolerance for floating-point calculations
            const tolerance = 0.01;

            // Check that all cells are formulas with correct results
            const sharksCorrect = sharkCell.type === 'formula' &&
                                  Math.abs(sharkCell.result - expectedSharkResult) < tolerance;

            const tunaCorrect = tunaCell.type === 'formula' &&
                                Math.abs(tunaCell.result - expectedTunaResult) < tolerance;

            const totalCorrect = totalCell.type === 'formula' &&
                                 Math.abs(totalCell.result - expectedTotalResult) < tolerance;

            return sharksCorrect && tunaCorrect && totalCorrect;
        },
        getErrorMessage: function() {
            const sharkCell = getCellData('A3');
            const tunaCell = getCellData('B3');
            const totalCell = getCellData('C3');

            // Expected values
            const expectedSharkResult = 81; // 90 * 0.9
            const expectedTunaResult = 120; // 100 * 1.2
            const expectedTotalResult = 201; // 81 + 120

            // Tolerance for floating-point calculations
            const tolerance = 0.01;

            if (sharkCell.type !== 'formula') {
                return "Cell A3 should contain a formula that starts with =. Try =A2*0.9";
            }

            if (Math.abs(sharkCell.result - expectedSharkResult) >= tolerance) {
                return "The formula in A3 isn't calculating correctly. It should be =A2*0.9 to reduce the shark population by 10%.";
            }

            if (tunaCell.type !== 'formula') {
                return "Cell B3 should contain a formula that starts with =. Try =B2*1.2";
            }

            if (Math.abs(tunaCell.result - expectedTunaResult) >= tolerance) {
                return "The formula in B3 isn't calculating correctly. It should be =B2*1.2 to increase the tuna population by 20%.";
            }

            if (totalCell.type !== 'formula') {
                return "Cell C3 should contain a formula that starts with =. Try =A3+B3";
            }

            if (Math.abs(totalCell.result - expectedTotalResult) >= tolerance) {
                return "The formula in C3 isn't calculating correctly. It should be =A3+B3 to sum the new shark and tuna populations.";
            }

            return "Please check your formulas and try again.";
        },
        getSuccessMessage: function() {
            // Generate verification code
            let verificationCode = "XXXXX";
            if (typeof window.makeVerification === 'function') {
                verificationCode = window.makeVerification(studentName, 1);
            }

            return `Congratulations ${studentName}! You've successfully created formulas to track population changes, with sharks decreasing to 81 and tuna increasing to 120, for a new total of 201 marine animals.

            <p><strong>Your verification code for Lesson 1 is: ${verificationCode}</strong></p>
            <p>Please provide this code to your instructor to verify completion of this lesson.</p>
            <p>You are now ready for Lesson 2!</p>`;
        }
    }
];

let currentExerciseIndex = 0;
let practiceButton;

// Initialize the lesson - function must be globally available
function initLesson() {
    console.log("Initializing Lesson 1");

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
        <div class="instruction-title">Lesson 1: Introduction to Spreadsheets for Life Sciences</div>
        <p>Welcome to your first spreadsheet lesson! In this lesson, you'll learn the fundamentals of working with spreadsheets:</p>
        <ul>
            <li>Entering data into cells</li>
            <li>Creating simple formulas</li>
            <li>Using cell references</li>
            <li>Building basic calculations</li>
        </ul>
        <p>Spreadsheets are powerful tools for organizing, analyzing, and calculating data in life sciences. The grid layout makes it easy to arrange information in rows and columns.</p>
        <p>Each cell in a spreadsheet can contain:</p>
        <ul>
            <li><strong>Text</strong> - Labels, descriptions, or any alphanumeric content</li>
            <li><strong>Numbers</strong> - Numerical values for calculations</li>
            <li><strong>Formulas</strong> - Calculations that reference other cells (always start with =)</li>
        </ul>
        <p>Click "Start Exercises" below to begin the hands-on practice!</p>
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
        const currentExercise = lesson1Exercises[currentExerciseIndex];

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
            if (currentExerciseIndex < lesson1Exercises.length) {
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
        if (currentExerciseIndex < lesson1Exercises.length) {
            showExercise(currentExerciseIndex);
            practiceButton.textContent = 'Check Answer';
        } else {
            // All exercises completed
            practiceButton.textContent = 'Next Lesson';
        }
    }
    else if (buttonState === 'Next Lesson') {
        // Load the next lesson (Lesson 2)
        const lessonButtons = document.querySelectorAll('.lesson-button');
        if (lessonButtons.length >= 2) {
            lessonButtons[1].click();  // Click Lesson 2 button
        }
    }
}

// Show a specific exercise
function showExercise(index) {
    if (index < 0 || index >= lesson1Exercises.length) {
        console.error(`Exercise index ${index} is out of range`);
        return;
    }

    const exercise = lesson1Exercises[index];
    let content = exercise.instruction;

    // Check if instruction is a function (for dynamic content)
    if (typeof content === 'function') {
        content = content();
    }

    window.updateInstructions(content, exercise.title);

    // Clear feedback area
    document.getElementById('feedbackArea').innerHTML = '';
}
