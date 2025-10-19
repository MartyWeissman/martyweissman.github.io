// Instructions and practice exercises
const practices = [
    {
        title: "Practice 1: Basic Cell Entry",
        instruction:
            `<p>Let's start with some basic data entry:</p>
            <ol>
                <li>Enter the number 10 in cell A1</li>
                <li>Enter the number 20 in cell B1</li>
                <li>Enter the text "Total" in cell C1</li>
            </ol>
            <p>Click the "Check Answer" button when you're done.</p>`,
        validate: function() {
            return getCellValue('A1') === '10' &&
                   getCellValue('B1') === '20' &&
                   getCellData('C1').type === 'text' &&
                   getCellValue('C1').toLowerCase() === 'total';
        }
    },
    {
        title: "Practice 2: Simple Formula",
        instruction:
            `<p>Now let's create a simple formula:</p>
            <ol>
                <li>In cell D1, create a formula that adds A1 and B1 (=A1+B1)</li>
            </ol>
            <p>The result should show 30.</p>`,
        validate: function() {
            const cellD1 = getCellData('D1');
            return cellD1.type === 'formula' &&
                   cellD1.formula.toLowerCase().replace(/\s+/g, '') === '=a1+b1' &&
                   cellD1.result === 30;
        }
    },
    {
        title: "Practice 3: Cell References",
        instruction:
            `<p>Let's work with cell references:</p>
            <ol>
                <li>Enter 5 in cell A2</li>
                <li>Enter 15 in cell B2</li>
                <li>In cell D2, create a formula that multiplies A2 by B2 (=A2*B2)</li>
            </ol>
            <p>The result should show 75.</p>`,
        validate: function() {
            return getCellValue('A2') === '5' &&
                   getCellValue('B2') === '15' &&
                   getCellData('D2').type === 'formula' &&
                   getCellData('D2').result === 75;
        }
    },
    {
        title: "Practice 4: Copy and Paste",
        instruction:
            `<p>Let's practice copy and paste with cell references:</p>
            <ol>
                <li>Click on cell D2 to select it</li>
                <li>Press Ctrl+C to copy it</li>
                <li>Click on cell D3</li>
                <li>Press Ctrl+V to paste it</li>
                <li>Enter 25 in cell A3</li>
                <li>Enter 3 in cell B3</li>
            </ol>
            <p>The formula in D3 should now calculate 25*3=75.</p>`,
        validate: function() {
            return getCellValue('A3') === '25' &&
                   getCellValue('B3') === '3' &&
                   getCellData('D3').type === 'formula' &&
                   getCellData('D3').result === 75 &&
                   getCellData('D3').formula.includes('A3') &&
                   getCellData('D3').formula.includes('B3');
        }
    },
    {
        title: "Practice 5: Absolute References",
        instruction:
            `<p>Let's learn about absolute references:</p>
            <ol>
                <li>Enter 10 in cell A5 (this will be our fixed multiplier)</li>
                <li>Enter 5 in cell B5</li>
                <li>In cell C5, create a formula =$A$5*B5</li>
                <li>Copy C5 (Ctrl+C) and paste it to C6 (Ctrl+V)</li>
                <li>Enter 8 in cell B6</li>
            </ol>
            <p>C5 should show 50 (10*5) and C6 should show 80 (10*8). The $A$5 reference stays fixed while B5 changes to B6.</p>`,
        validate: function() {
            return getCellValue('A5') === '10' &&
                   getCellValue('B5') === '5' &&
                   getCellValue('B6') === '8' &&
                   getCellData('C5').type === 'formula' &&
                   getCellData('C5').result === 50 &&
                   getCellData('C6').type === 'formula' &&
                   getCellData('C6').result === 80 &&
                   getCellData('C6').formula.includes('$A$5');
        }
    },
    {
        title: "Congratulations!",
        instruction:
            `<p>You've completed all the basic spreadsheet practices! You now know how to:</p>
            <ul>
                <li>Enter text and numbers</li>
                <li>Create formulas with cell references</li>
                <li>Copy and paste cells</li>
                <li>Use absolute references</li>
            </ul>
            <p>These are the fundamental skills for using spreadsheets! You can continue experimenting with the spreadsheet tool to practice further.</p>`,
        validate: function() {
            return true;
        }
    }
];

// Sample data sets for practice and demonstrations
const sampleDataSets = {
    sales: {
        name: "Monthly Sales",
        description: "Sample monthly sales data",
        data: [
            { cell: "A1", value: "Month" },
            { cell: "B1", value: "Sales" },
            { cell: "C1", value: "Expenses" },
            { cell: "D1", value: "Profit" },
            { cell: "A2", value: "Jan" },
            { cell: "B2", value: "5000" },
            { cell: "C2", value: "3000" },
            { cell: "D2", value: "=B2-C2" },
            { cell: "A3", value: "Feb" },
            { cell: "B3", value: "6200" },
            { cell: "C3", value: "3500" },
            { cell: "D3", value: "=B3-C3" },
            { cell: "A4", value: "Mar" },
            { cell: "B4", value: "7100" },
            { cell: "C4", value: "3800" },
            { cell: "D4", value: "=B4-C4" },
            { cell: "A5", value: "Total" },
            { cell: "B5", value: "=SUM(B2:B4)" },
            { cell: "C5", value: "=SUM(C2:C4)" },
            { cell: "D5", value: "=SUM(D2:D4)" }
        ]
    },
    grades: {
        name: "Student Grades",
        description: "Sample student grade calculation",
        data: [
            { cell: "A1", value: "Student" },
            { cell: "B1", value: "Quiz 1" },
            { cell: "C1", value: "Quiz 2" },
            { cell: "D1", value: "Final" },
            { cell: "E1", value: "Average" },
            { cell: "A2", value: "Alice" },
            { cell: "B2", value: "85" },
            { cell: "C2", value: "92" },
            { cell: "D2", value: "94" },
            { cell: "E2", value: "=AVERAGE(B2:D2)" },
            { cell: "A3", value: "Bob" },
            { cell: "B3", value: "78" },
            { cell: "C3", value: "85" },
            { cell: "D3", value: "81" },
            { cell: "E3", value: "=AVERAGE(B3:D3)" },
            { cell: "A4", value: "Charlie" },
            { cell: "B4", value: "92" },
            { cell: "C4", value: "88" },
            { cell: "D4", value: "95" },
            { cell: "E4", value: "=AVERAGE(B4:D4)" }
        ]
    },
    budget: {
        name: "Monthly Budget",
        description: "Monthly budget with percentage calculations",
        data: [
            { cell: "A1", value: "Category" },
            { cell: "B1", value: "Budget" },
            { cell: "C1", value: "Actual" },
            { cell: "D1", value: "Difference" },
            { cell: "E1", value: "% of Total" },
            { cell: "A2", value: "Rent" },
            { cell: "B2", value: "1200" },
            { cell: "C2", value: "1200" },
            { cell: "D2", value: "=C2-B2" },
            { cell: "A3", value: "Utilities" },
            { cell: "B3", value: "250" },
            { cell: "C3", value: "285" },
            { cell: "D3", value: "=C3-B3" },
            { cell: "A4", value: "Groceries" },
            { cell: "B4", value: "400" },
            { cell: "C4", value: "420" },
            { cell: "D4", value: "=C4-B4" },
            { cell: "A5", value: "Entertainment" },
            { cell: "B5", value: "200" },
            { cell: "C5", value: "175" },
            { cell: "D5", value: "=C5-B5" },
            { cell: "A6", value: "Total" },
            { cell: "B6", value: "=SUM(B2:B5)" },
            { cell: "C6", value: "=SUM(C2:C5)" },
            { cell: "D6", value: "=SUM(D2:D5)" },
            { cell: "E2", value: "=C2/$C$6" },
            { cell: "E3", value: "=C3/$C$6" },
            { cell: "E4", value: "=C4/$C$6" },
            { cell: "E5", value: "=C5/$C$6" },
            { cell: "E6", value: "1" }
        ]
    }
};

// Custom exercise validation templates
const customExerciseTemplates = [
    {
        title: "Sum Range Check",
        description: "Check if a cell contains a SUM formula referencing a specific range",
        validate: function(cellId, rangeStart, rangeEnd) {
            const cellData = getCellData(cellId);
            return cellData.type === 'formula' &&
                   cellData.formula.includes('SUM') &&
                   cellData.formula.includes(rangeStart) &&
                   cellData.formula.includes(rangeEnd);
        }
    },
    {
        title: "Average Range Check",
        description: "Check if a cell contains an AVERAGE formula referencing a specific range",
        validate: function(cellId, rangeStart, rangeEnd) {
            const cellData = getCellData(cellId);
            return cellData.type === 'formula' &&
                   cellData.formula.includes('AVERAGE') &&
                   cellData.formula.includes(rangeStart) &&
                   cellData.formula.includes(rangeEnd);
        }
    },
    {
        title: "Formula Result Check",
        description: "Check if a cell's formula produces an expected result",
        validate: function(cellId, expectedResult, tolerance = 0.01) {
            const cellData = getCellData(cellId);
            return cellData.type === 'formula' &&
                   Math.abs(cellData.result - expectedResult) <= tolerance;
        }
    }
];

let currentPracticeIndex = 0;

// Utility Functions for Spreadsheet Management

// Function to clear the entire spreadsheet
function clearSpreadsheet() {
    // Get all cell elements
    const cells = document.querySelectorAll('.editable-cell');

    for (const cell of cells) {
        const cellId = cell.dataset.id;
        clearCellData(cellId);

        // Update UI display
        cell.textContent = '';
        cell.style.color = 'black';
    }

    // Clear entry box if it's visible
    const entryBox = document.getElementById('entryBox');
    if (entryBox) {
        entryBox.value = '';
    }

    // Reset active cell to A1
    setActiveCell('A1');

    // Display confirmation message
    document.getElementById('feedbackArea').innerHTML = '<p class="success-message">Spreadsheet cleared successfully.</p>';

    console.log('Spreadsheet cleared');
}

// Function to load predetermined data into the spreadsheet
function loadSampleData(dataSetName) {
    // Clear the spreadsheet first
    clearSpreadsheet();

    // Check if the requested dataset exists
    if (!sampleDataSets[dataSetName]) {
        document.getElementById('feedbackArea').innerHTML =
            `<p style="color: red;">Dataset "${dataSetName}" not found.</p>`;
        return;
    }

    const dataSet = sampleDataSets[dataSetName];

    // Load each cell from the dataset
    for (const item of dataSet.data) {
        setCellValue(item.cell, item.value);
    }

    // Display confirmation message
    document.getElementById('feedbackArea').innerHTML =
        `<p class="success-message">Loaded "${dataSet.name}" dataset.</p>`;

    console.log(`Loaded sample data: ${dataSet.name}`);
}

// Function to check specific cell values with detailed feedback
function checkSpreadsheetValues(expectedValues, feedbackMessage) {
    let allCorrect = true;
    let incorrectCells = [];

    for (const expected of expectedValues) {
        const cellData = getCellData(expected.cell);
        let isCorrect = false;

        if (expected.type && cellData.type !== expected.type) {
            isCorrect = false;
        } else if (expected.value !== undefined) {
            // Check the display value for direct comparison
            isCorrect = (cellData.display === expected.value.toString());
        } else if (expected.result !== undefined) {
            // For formula results, check with a small tolerance for floating-point
            const tolerance = expected.tolerance || 0.001;
            isCorrect = Math.abs(cellData.result - expected.result) <= tolerance;
        }

        if (!isCorrect) {
            allCorrect = false;
            incorrectCells.push(expected.cell);
        }
    }

    // Prepare feedback message
    let feedback = '';
    if (allCorrect) {
        feedback = `<p class="success-message">${feedbackMessage || "All values are correct!"}</p>`;
    } else {
        feedback = `<p style="color: red;">Some values are incorrect. Check cells: ${incorrectCells.join(', ')}</p>`;
    }

    document.getElementById('feedbackArea').innerHTML = feedback;
    return allCorrect;
}

// Function to create a custom exercise from template
function createCustomExercise(title, instruction, validationFunction) {
    return {
        title: title,
        instruction: instruction,
        validate: validationFunction
    };
}

// Set up practice button
document.addEventListener('DOMContentLoaded', function() {
    const practiceButton = document.getElementById('practiceButton');

    practiceButton.addEventListener('click', function() {
        if (currentPracticeIndex === 0) {
            // Starting practices
            updateInstructions(practices[currentPracticeIndex]);
            this.textContent = 'Check Answer';
        } else if (currentPracticeIndex >= practices.length) {
            // Reset practices
            currentPracticeIndex = 0;
            updateInstructions(practices[currentPracticeIndex]);
            this.textContent = 'Check Answer';
            document.getElementById('feedbackArea').innerHTML = '';
        } else {
            // Check current practice
            const currentPractice = practices[currentPracticeIndex];

            if (currentPractice.validate()) {
                document.getElementById('feedbackArea').innerHTML = '<p class="success-message">Correct! Great job!</p>';
                currentPracticeIndex++;

                if (currentPracticeIndex < practices.length) {
                    updateInstructions(practices[currentPracticeIndex]);
                } else {
                    this.textContent = 'Restart Practice';
                }
            } else {
                document.getElementById('feedbackArea').innerHTML = '<p style="color: red;">Not quite right. Please try again.</p>';
            }
        }
    });

    // Create additional utility buttons
    createUtilityButtons();
});

// Create utility buttons for spreadsheet management
function createUtilityButtons() {
    const instructionsContainer = document.querySelector('.instructions-container');
    const practiceButton = document.getElementById('practiceButton');

    // Create container for utility buttons
    const utilityContainer = document.createElement('div');
    utilityContainer.className = 'utility-buttons';
    utilityContainer.style.marginTop = '20px';
    utilityContainer.style.borderTop = '1px solid #ddd';
    utilityContainer.style.paddingTop = '15px';

    // Add heading
    const utilityHeading = document.createElement('h3');
    utilityHeading.textContent = 'Spreadsheet Tools';
    utilityContainer.appendChild(utilityHeading);

    // Clear Spreadsheet button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Spreadsheet';
    clearButton.style.marginRight = '10px';
    clearButton.addEventListener('click', clearSpreadsheet);
    utilityContainer.appendChild(clearButton);

    // Create dropdown for sample data
    const datasetContainer = document.createElement('div');
    datasetContainer.style.marginTop = '10px';

    const datasetSelect = document.createElement('select');
    datasetSelect.style.padding = '5px';
    datasetSelect.style.marginRight = '10px';

    // Add options for each dataset
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Sample Data...';
    datasetSelect.appendChild(defaultOption);

    for (const key in sampleDataSets) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = sampleDataSets[key].name;
        datasetSelect.appendChild(option);
    }

    datasetContainer.appendChild(datasetSelect);

    // Load button
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load Sample Data';
    loadButton.addEventListener('click', function() {
        const selectedDataset = datasetSelect.value;
        if (selectedDataset) {
            loadSampleData(selectedDataset);
        } else {
            document.getElementById('feedbackArea').innerHTML =
                '<p style="color: red;">Please select a dataset to load.</p>';
        }
    });

    datasetContainer.appendChild(loadButton);
    utilityContainer.appendChild(datasetContainer);

    // Add container after the practice button
    instructionsContainer.insertBefore(utilityContainer, document.getElementById('feedbackArea'));
}

// Update the instructions area
function updateInstructions(practice) {
    const instructionArea = document.querySelector('.current-instruction');
    instructionArea.innerHTML = `
        <div class="instruction-title">${practice.title}</div>
        ${practice.instruction}
    `;
    document.getElementById('feedbackArea').innerHTML = '';
}
