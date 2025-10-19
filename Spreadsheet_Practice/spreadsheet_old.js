// Add dependencies for all cells in a range
function addRangeDependencies(startCell, endCell, formulaCellId) {
    console.log(`Adding range dependencies for ${formulaCellId} from ${startCell} to ${endCell}`);

    // Parse start and end cell coordinates
    const startCol = startCell.charCodeAt(0) - 65; // A=0, B=1, etc.
    const startRow = parseInt(startCell.substring(1));

    const endCol = endCell.charCodeAt(0) - 65;
    const endRow = parseInt(endCell.substring(1));

    // Collect all cells in the range
    const cellsInRange = [];

    for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
            const cellId = String.fromCharCode(65 + col) + row;
            cellsInRange.push(cellId);
        }
    }

    // Update the reverse dependency graph for the formula cell
    if (!reverseDependencyGraph[formulaCellId]) {
        reverseDependencyGraph[formulaCellId] = [];
    }

    // Add each cell in the range as a dependency
    for (const cellId of cellsInRange) {
        // Add to reverse dependencies (what cells this formula depends on)
        if (!reverseDependencyGraph[formulaCellId].includes(cellId)) {
            reverseDependencyGraph[formulaCellId].push(cellId);
        }

        // Add to forward dependencies (what cells depend on each range cell)
        if (!dependencyGraph[cellId]) {
            dependencyGraph[cellId] = [];
        }
        if (!dependencyGraph[cellId].includes(formulaCellId)) {
            dependencyGraph[cellId].push(formulaCellId);
        }
    }

    console.log(`Added dependencies: ${formulaCellId} depends on ${cellsInRange.join(', ')}`);
}// Recalculate all formula cells
function recalculateAllFormulas() {
    // Store previous display values to check for changes
    const previousDisplays = {};
    for (const cellId in cellData) {
        previousDisplays[cellId] = cellData[cellId].display;
    }

    // First pass: Evaluate all formulas
    for (const cellId in cellData) {
        if (cellData[cellId].type === 'formula') {
            try {
                const result = evaluateFormula(cellData[cellId].formula.substring(1), cellId);
                cellData[cellId].result = result;
                cellData[cellId].display = isNaN(result) ? result : (Math.round(result * 1000) / 1000).toString();
            } catch (error) {
                cellData[cellId].result = '#ERROR';
                cellData[cellId].display = '#ERROR';
            }
        }
    }

    // Second pass: Update only cells whose display value has changed
    for (const cellId in cellData) {
        if (cellData[cellId].display !== previousDisplays[cellId]) {
            const cell = document.querySelector(`[data-id="${cellId}"]`);
            if (cell) {
                cell.textContent = cellData[cellId].display;

                // Update cell color based on type
                if (cellData[cellId].type === 'formula') {
                    cell.style.color = '#0000CC';  // Dark blue for formulas
                } else if (cellData[cellId].type === 'text') {
                    cell.style.color = '#008800';  // Green for text
                } else {
                    cell.style.color = '#000000';  // Black for numbers and null
                }
            }
        }
    }
}// Get the value of a cell reference
function getCellReferenceValue(cellRef, currentCellId) {
    // Prevent circular references
    if (cellRef === currentCellId) {
        throw new Error('Circular reference detected');
    }

    // Get the value from the referenced cell
    if (cellData[cellRef]) {
        const refCellValue = cellData[cellRef].result;

        // Check if the value is a number or can be parsed as one
        if (typeof refCellValue === 'number') {
            return refCellValue;
        } else if (!isNaN(refCellValue) && !isNaN(parseFloat(refCellValue))) {
            return parseFloat(refCellValue);
        } else if (refCellValue === '' || refCellValue === undefined) {
            // Empty cells now cause an error instead of defaulting to 0
            throw new Error(`Cell ${cellRef} is empty`);
        } else {
            throw new Error('Referenced cell does not contain a number');
        }
    } else {
        // Cell reference not found should also throw an error
        throw new Error(`Invalid cell reference: ${cellRef}`);
    }
}// Cell data storage
const cellData = {};
let activeCell = null;
let navigationMode = true;
let clipboard = null;  // For copy/paste functionality

// ========== CALCULATION ENGINE ==========
// Store cell dependencies - which cells depend on which other cells
const dependencyGraph = {
    // cellId: [dependent cells]
    // For example: 'A1': ['B1', 'C1'] means B1 and C1 both reference A1
};

// Store reverse dependencies - which cells a formula depends on
const reverseDependencyGraph = {
    // cellId: [cells this depends on]
    // For example: 'C1': ['A1', 'B1'] means C1 formula references A1 and B1
};

// Initialize the calculation system
function initCalculationEngine() {
    // Clear any existing dependencies
    clearDependencyGraphs();
}

// Clear dependency graphs
function clearDependencyGraphs() {
    for (const key in dependencyGraph) {
        delete dependencyGraph[key];
    }
    for (const key in reverseDependencyGraph) {
        delete reverseDependencyGraph[key];
    }
}

// Track dependencies for a formula
function trackDependencies(cellId, formula) {
    console.log(`Tracking dependencies for ${cellId} with formula: ${formula}`);

    // Clear existing reverse dependencies for this cell
    if (reverseDependencyGraph[cellId]) {
        // Remove this cell from all cells it previously depended on
        for (const depOnCell of reverseDependencyGraph[cellId]) {
            if (dependencyGraph[depOnCell]) {
                const index = dependencyGraph[depOnCell].indexOf(cellId);
                if (index !== -1) {
                    dependencyGraph[depOnCell].splice(index, 1);
                    console.log(`Removed ${cellId} from dependencies of ${depOnCell}`);
                }
            }
        }
    }

    // Extract cell references from the formula - this now handles ranges correctly
    const cellRefs = extractCellReferences(formula);

    // Store reverse dependencies (what this cell depends on)
    reverseDependencyGraph[cellId] = cellRefs;

    // Update forward dependencies (what cells depend on this cell)
    for (const ref of cellRefs) {
        if (!dependencyGraph[ref]) {
            dependencyGraph[ref] = [];
        }
        if (!dependencyGraph[ref].includes(cellId)) {
            dependencyGraph[ref].push(cellId);
            console.log(`Added ${cellId} as dependent of ${ref}`);
        }
    }

    console.log('Current dependency graph:', dependencyGraph);
    console.log('Current reverse dependency graph:', reverseDependencyGraph);
}

// Extract cell references from a formula
function extractCellReferences(formula) {
    const refs = [];
    console.log(`Extracting cell references from formula: ${formula}`);

    // First, check for range notations (A1:B5) and expand them
    const rangePattern = /([A-E])([1-9]|1[0-9]|20):([A-E])([1-9]|1[0-9]|20)/g;
    let rangeMatch;
    let expandedFormula = formula;

    while ((rangeMatch = rangePattern.exec(formula)) !== null) {
        const startCol = rangeMatch[1].charCodeAt(0) - 65; // A=0, B=1, etc.
        const startRow = parseInt(rangeMatch[2]);
        const endCol = rangeMatch[3].charCodeAt(0) - 65;
        const endRow = parseInt(rangeMatch[4]);

        console.log(`Found range: ${rangeMatch[1]}${rangeMatch[2]}:${rangeMatch[3]}${rangeMatch[4]}`);

        // Extract all cell references within the range
        for (let col = startCol; col <= endCol; col++) {
            for (let row = startRow; row <= endRow; row++) {
                const cellId = String.fromCharCode(65 + col) + row;
                refs.push(cellId);
                console.log(`Added cell from range: ${cellId}`);
            }
        }
    }

    // Then look for individual cell references (not within a range notation)
    const cellRefPattern = /\b([A-E])([1-9]|1[0-9]|20)\b/g;
    let match;

    while ((match = cellRefPattern.exec(formula)) !== null) {
        const colLetter = match[1];
        const rowNumber = match[2];
        const cellRef = colLetter + rowNumber;

        // Check if this cell is already added (from range expansion)
        if (!refs.includes(cellRef)) {
            refs.push(cellRef);
            console.log(`Found individual cell reference: ${cellRef}`);
        }
    }

    console.log(`All references found: ${refs.join(', ') || 'none'}`);
    return refs;
}

// Calculate all formulas in the correct order
function calculateAllFormulas() {
    // Store previous display values to check for changes
    const previousDisplays = {};
    for (const cellId in cellData) {
        previousDisplays[cellId] = cellData[cellId].display;
    }

    // Get a calculation order that respects dependencies
    // DFS already gives us the correct order: [A3, A4, A5, A6, A7, A8, B8]
    const calculationOrder = getCalculationOrder();

    // Debug the calculation order
    console.log('Calculation order:', calculationOrder);

    // Calculate each cell in the determined order
    for (const cellId of calculationOrder) {
        console.log(`Calculating formula in ${cellId}: ${cellData[cellId].formula}`);
        try {
            const result = evaluateFormula(cellData[cellId].formula.substring(1), cellId);
            cellData[cellId].result = result;
            cellData[cellId].display = isNaN(result) ? result : (Math.round(result * 1000) / 1000).toString();
            console.log(`${cellId} result: ${cellData[cellId].display}`);
        } catch (error) {
            console.error(`Error calculating ${cellId}: ${error.message}`);
            cellData[cellId].result = '#ERROR';
            cellData[cellId].display = '#ERROR';
        }
    }

    // Update cell displays that have changed
    for (const cellId in cellData) {
        if (cellData[cellId].display !== previousDisplays[cellId]) {
            console.log(`Updating display of ${cellId} from "${previousDisplays[cellId]}" to "${cellData[cellId].display}"`);
            const cell = document.querySelector(`[data-id="${cellId}"]`);
            if (cell) {
                cell.textContent = cellData[cellId].display;

                // Update cell color based on type
                if (cellData[cellId].type === 'formula') {
                    cell.style.color = '#0000CC';  // Dark blue for formulas
                } else if (cellData[cellId].type === 'text') {
                    cell.style.color = '#008800';  // Green for text
                } else {
                    cell.style.color = '#000000';  // Black for numbers and null
                }
            }
        }
    }
}

// Determine the correct calculation order respecting dependencies
function getCalculationOrder() {
    console.log("Determining calculation order...");
    console.log("Dependency graph:", JSON.stringify(dependencyGraph, null, 2));
    console.log("Reverse dependency graph:", JSON.stringify(reverseDependencyGraph, null, 2));

    const visited = new Set();
    const tempVisited = new Set();
    const order = [];

    // Only include non-null cells
    const allCells = Object.keys(cellData).filter(cellId =>
        cellData[cellId].type !== 'null' && cellData[cellId].value !== '');

    // Only process formula cells for our calculation
    const formulaCells = allCells.filter(cellId => cellData[cellId].type === 'formula');

    console.log("Non-null cells:", allCells);
    console.log("Formula cells:", formulaCells);

    // Depth-first search with cycle detection
    function dfs(cellId) {
        console.log(`DFS visiting: ${cellId}`);

        // Skip if already processed
        if (visited.has(cellId)) {
            console.log(`${cellId} already visited, skipping`);
            return;
        }

        // Detect circular dependencies
        if (tempVisited.has(cellId)) {
            console.error(`Circular dependency detected involving cell ${cellId}`);
            throw new Error(`Circular dependency detected involving cell ${cellId}`);
        }

        // Mark as being processed
        tempVisited.add(cellId);

        // First process any cells this one depends on
        if (reverseDependencyGraph[cellId]) {
            console.log(`${cellId} depends on: ${reverseDependencyGraph[cellId].join(', ')}`);
            for (const depOnCell of reverseDependencyGraph[cellId]) {
                // Skip null cells and throw error if formula depends on them
                if (!cellData[depOnCell] || cellData[depOnCell].type === 'null' || cellData[depOnCell].value === '') {
                    console.error(`Formula in ${cellId} references empty cell ${depOnCell}`);
                    throw new Error(`Cell ${depOnCell} is empty`);
                }
                dfs(depOnCell);
            }
        }

        // Mark as processed and add to order
        tempVisited.delete(cellId);
        visited.add(cellId);

        // Only add this cell to the calculation order if it's a formula
        if (cellData[cellId] && cellData[cellId].type === 'formula') {
            order.push(cellId);
            console.log(`Added ${cellId} to calculation order`);
        }
    }

    // Process cells to build calculation order
    try {
        // Process all formula cells - this will include their dependencies
        for (const cellId of formulaCells) {
            if (!visited.has(cellId)) {
                dfs(cellId);
            }
        }
    } catch (error) {
        console.error('Error generating calculation order:', error.message);
        // On error, return just the formula cells in simple order
        return formulaCells;
    }

    console.log("Final calculation order:", order);
    return order;
}
// ========== END CALCULATION ENGINE ==========

// Create the spreadsheet
function createSpreadsheet() {
    const spreadsheet = document.getElementById('spreadsheet');

    // Create header row with column letters
    const headerRow = document.createElement('div');
    headerRow.className = 'row';

    // Empty cell for the top-left corner
    const cornerCell = document.createElement('div');
    cornerCell.className = 'header-cell';
    headerRow.appendChild(cornerCell);

    // Add column headers (A through E)
    for (let i = 0; i < 5; i++) {
        const headerCell = document.createElement('div');
        headerCell.className = 'header-cell';
        headerCell.textContent = String.fromCharCode(65 + i); // A, B, C, D, E
        headerRow.appendChild(headerCell);
    }

    spreadsheet.appendChild(headerRow);

    // Create rows with data cells
    for (let row = 1; row <= 20; row++) {
        const dataRow = document.createElement('div');
        dataRow.className = 'row';

        // Row header (1-20)
        const rowHeader = document.createElement('div');
        rowHeader.className = 'header-cell row-header';
        rowHeader.textContent = row;
        dataRow.appendChild(rowHeader);

        // Data cells
        for (let col = 0; col < 5; col++) {
            const colLetter = String.fromCharCode(65 + col);
            const cellId = `${colLetter}${row}`;

            const cell = document.createElement('div');
            cell.className = 'cell editable-cell';
            cell.dataset.row = row;
            cell.dataset.col = colLetter;
            cell.dataset.id = cellId;
            cell.addEventListener('click', function() {
                setActiveCell(cellId);
            });
            cell.addEventListener('dblclick', function() {
                setActiveCell(cellId);
                startEditing();
            });

            // Initialize cell data
            cellData[cellId] = {
                type: 'null',
                value: '',
                formula: '',
                display: '',
                result: ''
            };

            dataRow.appendChild(cell);
        }

        spreadsheet.appendChild(dataRow);
    }

    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    const entryBox = document.getElementById('entryBox');

    entryBox.addEventListener('focus', function() {
        navigationMode = false;
    });

    entryBox.addEventListener('blur', function() {
        // Short delay before enabling navigation mode to prevent conflicts
        setTimeout(() => {
            navigationMode = true;
        }, 10);
    });

    entryBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (activeCell) {
                // Save the current value
                const currentValue = this.value;

                // If it's a formula, also update dependencies
                if (currentValue.trim().startsWith('=')) {
                    findDependencies(currentValue.trim().substring(1), activeCell);
                }

                // Set the cell value and update UI
                setCellValue(activeCell, currentValue);
                this.blur();
                // Explicitly set navigation mode
                navigationMode = true;
                // Move down
                moveActive('down');
            }
        } else if (event.key === 'Tab') {
            event.preventDefault();
            if (activeCell) {
                // Save the current value
                const currentValue = this.value;

                // If it's a formula, also update dependencies
                if (currentValue.trim().startsWith('=')) {
                    findDependencies(currentValue.trim().substring(1), activeCell);
                }

                // Set the cell value and update UI
                setCellValue(activeCell, currentValue);
                this.blur();
                // Explicitly set navigation mode
                navigationMode = true;
                // Move right or left - prevent further processing
                moveActive(event.shiftKey ? 'left' : 'right');
                return false;
            }
        } else if (event.key === 'Escape') {
            event.preventDefault();
            // Revert to original value
            this.value = cellData[activeCell].value;
            this.blur();
            // Explicitly set navigation mode
            navigationMode = true;
        }
    });

    // Add global keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (!navigationMode) return;

        // Handle copy/paste keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            if (event.key === 'c' || event.key === 'C') {
                // Copy
                event.preventDefault();
                if (activeCell) {
                    clipboard = {
                        cellId: activeCell,
                        data: JSON.parse(JSON.stringify(cellData[activeCell]))
                    };
                    // Flash the active cell to indicate copy
                    const activeElement = document.querySelector(`[data-id="${activeCell}"]`);
                    activeElement.style.backgroundColor = '#e6f2ff';
                    setTimeout(() => { activeElement.style.backgroundColor = ''; }, 200);
                }
                return;
            } else if (event.key === 'v' || event.key === 'V') {
                // Paste
                event.preventDefault();
                if (activeCell && clipboard) {
                    pasteCellData(activeCell, clipboard);
                }
                return;
            } else if (event.key === 'x' || event.key === 'X') {
                // Cut
                event.preventDefault();
                if (activeCell) {
                    clipboard = {
                        cellId: activeCell,
                        data: JSON.parse(JSON.stringify(cellData[activeCell]))
                    };
                    clearActiveCell();
                }
                return;
            }
        }

        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                moveActive('up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                moveActive('down');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                moveActive('left');
                break;
            case 'ArrowRight':
                event.preventDefault();
                moveActive('right');
                break;
            case 'Enter':
                event.preventDefault();
                startEditing();
                break;
            case 'Delete':
            case 'Backspace':
                event.preventDefault();
                if (activeCell) {
                    // Clear the cell entirely while staying in navigation mode
                    clearActiveCell();
                }
                break;
            default:
                // If it's a printable character, start editing with that character
                if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
                    event.preventDefault();
                    startEditingWithChar(event.key);
                    // Ensure we're in editing mode
                    navigationMode = false;
                }
        }
    });
}

// Set the active cell
function setActiveCell(cellId) {
    // Remove highlight from previous active cell
    if (activeCell) {
        document.querySelector(`[data-id="${activeCell}"]`).classList.remove('active-cell');

        // Get previous row and column from activeCell
        const prevCol = activeCell.charAt(0);
        const prevRow = activeCell.substring(1);

        // Remove highlight from previous column header (first row)
        const colIndex = prevCol.charCodeAt(0) - 64; // Convert A->1, B->2, etc.
        const prevColHeader = document.querySelector(`.row:first-child .header-cell:nth-child(${colIndex + 1})`);
        if (prevColHeader) prevColHeader.classList.remove('header-highlight');

        // Remove highlight from previous row header
        const rowIndex = parseInt(prevRow);
        const prevRowHeader = document.querySelector(`.row:nth-child(${rowIndex + 1}) .header-cell:first-child`);
        if (prevRowHeader) prevRowHeader.classList.remove('header-highlight');
    }

    // Set new active cell
    activeCell = cellId;
    document.querySelector(`[data-id="${activeCell}"]`).classList.add('active-cell');

    // Get new row and column
    const col = activeCell.charAt(0);
    const row = activeCell.substring(1);

    // Highlight new column header
    const colIndex = col.charCodeAt(0) - 64; // Convert A->1, B->2, etc.
    const colHeader = document.querySelector(`.row:first-child .header-cell:nth-child(${colIndex + 1})`);
    if (colHeader) colHeader.classList.add('header-highlight');

    // Highlight new row header
    const rowIndex = parseInt(row);
    const rowHeader = document.querySelector(`.row:nth-child(${rowIndex + 1}) .header-cell:first-child`);
    if (rowHeader) rowHeader.classList.add('header-highlight');

    // Update the active cell display
    document.getElementById('activeCellDisplay').textContent = activeCell;

    // Update the entry box with the cell's raw value
    const entryBox = document.getElementById('entryBox');
    const cellInfo = cellData[activeCell];

    if (cellInfo.type === 'formula') {
        entryBox.value = cellInfo.formula;
    } else {
        entryBox.value = cellInfo.value;
    }
}

// Start editing the current cell
function startEditing() {
    if (!activeCell) return;

    const entryBox = document.getElementById('entryBox');
    entryBox.focus();
    entryBox.select();
}

// Start editing with initial character
function startEditingWithChar(char) {
    if (!activeCell) return;

    const entryBox = document.getElementById('entryBox');
    entryBox.value = char;
    entryBox.focus();

    // Explicitly set editing mode
    navigationMode = false;

    // Place cursor at the end
    entryBox.selectionStart = entryBox.selectionEnd = entryBox.value.length;
}

// Clear the active cell
function clearActiveCell() {
    if (!activeCell) return;

    // Reset cell data to null state
    cellData[activeCell] = {
        type: 'null',
        value: '',
        formula: '',
        display: '',
        result: ''
    };

    // Clear display
    const cell = document.querySelector(`[data-id="${activeCell}"]`);
    cell.textContent = '';
    cell.style.color = 'black';

    // Update entry box
    const entryBox = document.getElementById('entryBox');
    entryBox.value = '';

    // Stay in navigation mode
    navigationMode = true;
}

// Move active cell in specified direction
function moveActive(direction) {
    if (!activeCell) return;

    const cell = document.querySelector(`[data-id="${activeCell}"]`);
    const row = parseInt(cell.dataset.row);
    const col = cell.dataset.col.charCodeAt(0) - 65; // Convert A-E to 0-4

    let newRow = row;
    let newCol = col;

    switch (direction) {
        case 'up':
            newRow = Math.max(1, row - 1);
            break;
        case 'down':
            newRow = Math.min(20, row + 1);
            break;
        case 'left':
            newCol = Math.max(0, col - 1);
            break;
        case 'right':
            newCol = Math.min(4, col + 1);
            break;
    }

    const newColLetter = String.fromCharCode(65 + newCol);
    const newCellId = `${newColLetter}${newRow}`;

    if (newCellId !== activeCell) {
        setActiveCell(newCellId);
    }
}

// Set cell value and type
function setCellValue(cellId, inputValue) {
    const cell = document.querySelector(`[data-id="${cellId}"]`);
    const value = inputValue.trim();

    // Determine the type of the value
    let type, displayValue, result;

    if (value === '') {
        type = 'null';
        displayValue = '';
        result = '';

        // Clear dependencies if cell was previously a formula
        if (cellData[cellId] && cellData[cellId].type === 'formula') {
            if (reverseDependencyGraph[cellId]) {
                // Remove this cell from all cells it previously depended on
                for (const depOnCell of reverseDependencyGraph[cellId]) {
                    if (dependencyGraph[depOnCell]) {
                        const index = dependencyGraph[depOnCell].indexOf(cellId);
                        if (index !== -1) {
                            dependencyGraph[depOnCell].splice(index, 1);
                        }
                    }
                }
                delete reverseDependencyGraph[cellId];
            }
        }
    } else if (value.startsWith('=')) {
        type = 'formula';

        // Track the formula's dependencies
        trackDependencies(cellId, value.substring(1));

        // Initial evaluation (will be recalculated in correct order later)
        try {
            result = evaluateFormula(value.substring(1), cellId);
            displayValue = isNaN(result) ? result : (Math.round(result * 1000) / 1000).toString();
        } catch (error) {
            console.error('Formula error:', error.message);
            result = '#ERROR';
            displayValue = '#ERROR';
        }
    } else if (!isNaN(value) && !isNaN(parseFloat(value))) {
        type = 'number';
        displayValue = value;
        result = parseFloat(value);

        // Clear dependencies if cell was previously a formula
        if (cellData[cellId] && cellData[cellId].type === 'formula') {
            if (reverseDependencyGraph[cellId]) {
                // Remove this cell from all cells it previously depended on
                for (const depOnCell of reverseDependencyGraph[cellId]) {
                    if (dependencyGraph[depOnCell]) {
                        const index = dependencyGraph[depOnCell].indexOf(cellId);
                        if (index !== -1) {
                            dependencyGraph[depOnCell].splice(index, 1);
                        }
                    }
                }
                delete reverseDependencyGraph[cellId];
            }
        }
    } else {
        type = 'text';
        displayValue = value;
        result = value;

        // Clear dependencies if cell was previously a formula
        if (cellData[cellId] && cellData[cellId].type === 'formula') {
            if (reverseDependencyGraph[cellId]) {
                // Remove this cell from all cells it previously depended on
                for (const depOnCell of reverseDependencyGraph[cellId]) {
                    if (dependencyGraph[depOnCell]) {
                        const index = dependencyGraph[depOnCell].indexOf(cellId);
                        if (index !== -1) {
                            dependencyGraph[depOnCell].splice(index, 1);
                        }
                    }
                }
                delete reverseDependencyGraph[cellId];
            }
        }
    }

    // Update cell data
    cellData[cellId] = {
        type: type,
        value: value,
        formula: type === 'formula' ? value : '',
        display: displayValue,
        result: result
    };

    // Update the cell display
    cell.textContent = displayValue;

    // Visual styling based on type
    if (type === 'formula') {
        cell.style.color = '#0000CC';  // Dark blue for formulas
    } else if (type === 'text') {
        cell.style.color = '#008800';  // Green for text
    } else {
        cell.style.color = '#000000';  // Black for numbers and null
    }

    // Debug info
    console.log(`Cell ${cellId} updated to ${value}`);
    console.log(`Dependencies for ${cellId}:`, reverseDependencyGraph[cellId] || 'none');
    console.log(`Cells depending on ${cellId}:`, dependencyGraph[cellId] || 'none');

    // Recalculate all formulas in the correct order
    calculateAllFormulas();
}

// Evaluate a formula
function evaluateFormula(formula, currentCellId) {
    console.log(`Evaluating formula for ${currentCellId}: ${formula}`);

    // Process possible cell reference issues with B10, etc.
    // This is to fix a specific bug with double-digit cell references
    const formulaWithoutSpace = formula.replace(/\s+/g, '');

    // Check for SUM and AVERAGE functions first
    const sumPattern = /SUM\(([A-E](?:[1-9]|1[0-9]|20)):([A-E](?:[1-9]|1[0-9]|20))\)/g;
    const avgPattern = /AVERAGE\(([A-E](?:[1-9]|1[0-9]|20)):([A-E](?:[1-9]|1[0-9]|20))\)/g;

    // Process SUM function
    if (formula.includes('SUM(')) {
        let sumFormula = formula;

        sumFormula = sumFormula.replace(sumPattern, function(match, startCell, endCell) {
            return calculateRangeFunction(startCell, endCell, 'SUM', currentCellId);
        });

        // If there was a SUM function, evaluate the resulting formula
        if (sumFormula !== formula) {
            return evaluateFormula(sumFormula, currentCellId);
        }
    }

    // Process AVERAGE function
    if (formula.includes('AVERAGE(')) {
        let avgFormula = formula;

        avgFormula = avgFormula.replace(avgPattern, function(match, startCell, endCell) {
            return calculateRangeFunction(startCell, endCell, 'AVERAGE', currentCellId);
        });

        // If there was an AVERAGE function, evaluate the resulting formula
        if (avgFormula !== formula) {
            return evaluateFormula(avgFormula, currentCellId);
        }
    }

    // Check for implicit multiplication with cell references (like 5A1 instead of 5*A1)
    const implicitMultPattern = /(\d+)([A-E](?:[1-9]|1[0-9]|20))/g;
    if (implicitMultPattern.test(formula)) {
        throw new Error('Implicit multiplication not allowed (e.g., use 5*A1 instead of 5A1)');
    }

    // Check for implicit multiplication with parentheses (like 5(A1+A2) instead of 5*(A1+A2))
    const implicitParenPattern = /(\d+)(\()/g;
    if (implicitParenPattern.test(formula)) {
        throw new Error('Implicit multiplication not allowed (e.g., use 5*(A1+A2) instead of 5(A1+A2))');
    }

    // Replace cell references with their values
    let processedFormula = formulaWithoutSpace;

    // First pass: Find all cell references
    const cellRefs = [];
    let cellRefMatch;
    const findCellRefs = /([A-E])([1-9]|1[0-9]|20)\b/g;

    while ((cellRefMatch = findCellRefs.exec(formulaWithoutSpace)) !== null) {
        const colLetter = cellRefMatch[1];
        const rowNumber = cellRefMatch[2];
        const fullRef = colLetter + rowNumber;
        const startIndex = cellRefMatch.index;
        const endIndex = startIndex + fullRef.length;

        // Only consider this a cell reference if:
        // 1. It's at the start of the formula, or
        // 2. The preceding character is not a letter or number (to avoid mistaking parts of functions as cell refs)
        if (startIndex === 0 || !/[A-Za-z0-9]/.test(formulaWithoutSpace.charAt(startIndex - 1))) {
            cellRefs.push({
                ref: fullRef,
                start: startIndex,
                end: endIndex
            });
        }
    }

    // Sort in reverse order so replacements don't affect later indices
    cellRefs.sort((a, b) => b.start - a.start);

    // Replace each cell reference with its value
    for (const cellRef of cellRefs) {
        const refValue = getCellReferenceValue(cellRef.ref, currentCellId);
        processedFormula =
            processedFormula.substring(0, cellRef.start) +
            refValue +
            processedFormula.substring(cellRef.end);
    }

    // Also handle absolute references (with $ signs)
    const absoluteCellRefPattern = /\$([A-E])\$([1-9]|1[0-9]|20)\b/g;
    const colAbsPattern = /\$([A-E])([1-9]|1[0-9]|20)\b/g;
    const rowAbsPattern = /([A-E])\$([1-9]|1[0-9]|20)\b/g;

    // Replace absolute cell references
    processedFormula = processedFormula.replace(absoluteCellRefPattern, function(match, col, row) {
        return getCellReferenceValue(col + row, currentCellId);
    });

    // Replace column-absolute references
    processedFormula = processedFormula.replace(colAbsPattern, function(match, col, row) {
        return getCellReferenceValue(col + row, currentCellId);
    });

    // Replace row-absolute references
    processedFormula = processedFormula.replace(rowAbsPattern, function(match, col, row) {
        return getCellReferenceValue(col + row, currentCellId);
    });

    // Clean the formula - remove excess whitespace
    processedFormula = processedFormula.replace(/\s+/g, '');

    // Basic validation to ensure only allowed characters
    if (!/^[0-9+\-*/().]+$/.test(processedFormula)) {
        throw new Error('Formula contains invalid characters');
    }

    // Evaluate the formula
    try {
        // Using Function instead of eval for better security
        const result = Function('"use strict"; return (' + processedFormula + ')')();

        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Formula resulted in an invalid value');
        }

        return result;
    } catch (error) {
        throw new Error('Error evaluating formula');
    }
}

// Calculate function for a range of cells (SUM or AVERAGE)
function calculateRangeFunction(startCell, endCell, functionType, currentCellId) {
    console.log(`Calculating ${functionType} for range ${startCell}:${endCell}`);

    // Parse start and end cell coordinates
    const startCol = startCell.charCodeAt(0) - 65; // A=0, B=1, etc.
    const startRow = parseInt(startCell.substring(1));

    const endCol = endCell.charCodeAt(0) - 65;
    const endRow = parseInt(endCell.substring(1));

    // Validate the range
    if (startCol > endCol || startRow > endRow) {
        throw new Error('Invalid range: start cell must be before end cell (both row and column)');
    }

    // Keep track of all cells in this range for dependency tracking
    const cellsInRange = [];

    // Gather values from the range
    const values = [];
    let sum = 0;
    let count = 0;

    for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
            const cellId = String.fromCharCode(65 + col) + row;

            // Add to the list of cells in this range
            cellsInRange.push(cellId);

            // Skip the current cell to avoid circular references
            if (cellId === currentCellId) {
                continue;
            }

            if (cellData[cellId]) {
                const cellValue = cellData[cellId].result;

                // Check if the value is valid
                if (typeof cellValue === 'number') {
                    values.push(cellValue);
                    sum += cellValue;
                    count++;
                } else if (!isNaN(cellValue) && !isNaN(parseFloat(cellValue))) {
                    const numValue = parseFloat(cellValue);
                    values.push(numValue);
                    sum += numValue;
                    count++;
                } else if (cellValue === '' || cellValue === undefined) {
                    // Empty cells cause an error
                    throw new Error(`Range includes empty cell ${cellId}`);
                } else {
                    throw new Error(`Cell ${cellId} in range does not contain a number`);
                }
            } else {
                throw new Error(`Invalid cell reference in range: ${cellId}`);
            }
        }
    }

    console.log(`Range ${startCell}:${endCell} includes cells: ${cellsInRange.join(', ')}`);

    // Calculate the result based on function type
    if (functionType === 'SUM') {
        return sum;
    } else if (functionType === 'AVERAGE') {
        if (count === 0) {
            throw new Error('Cannot calculate average of an empty range');
        }
        return sum / count;
    } else {
        throw new Error(`Unknown function: ${functionType}`);
    }
}

// Keep track of which cells depend on others
const cellDependencies = {};

// Find all dependencies in a formula
function findDependencies(formula, cellId) {
    // Extract cell references from the formula - support for both absolute and relative references
    const cellRefPattern = /\$?[A-E]\$?(?:[1-9]|1[0-9]|20)/g;
    const dependencies = formula.match(cellRefPattern) || [];

    // Convert absolute references to their base cell
    const normalizedDeps = dependencies.map(dep =>
        dep.replace(/\$/g, '')  // Remove $ signs for dependency tracking
    );

    // Update the dependencies list for each referenced cell
    normalizedDeps.forEach(depCellId => {
        if (!cellDependencies[depCellId]) {
            cellDependencies[depCellId] = [];
        }

        // Add this cell as dependent if not already there
        if (!cellDependencies[depCellId].includes(cellId)) {
            cellDependencies[depCellId].push(cellId);
        }
    });

    return normalizedDeps;
}

// Recalculate cells that depend on the changed cell
function recalculateDependentCells(cellId) {
    if (!cellDependencies[cellId]) return;

    const processed = new Set();

    function processCell(id) {
        if (processed.has(id)) return;
        processed.add(id);

        const cell = cellData[id];
        if (cell && cell.type === 'formula') {
            try {
                const result = evaluateFormula(cell.formula.substring(1), id);
                const displayValue = isNaN(result) ? result : (Math.round(result * 1000) / 1000).toString();

                // Update the cell
                cell.result = result;
                cell.display = displayValue;

                const cellElement = document.querySelector(`[data-id="${id}"]`);
                if (cellElement) {
                    cellElement.textContent = displayValue;
                }

                // Process cells that depend on this one
                if (cellDependencies[id]) {
                    cellDependencies[id].forEach(depId => {
                        processCell(depId);
                    });
                }
            } catch (error) {
                // Handle errors in formula
                cell.result = '#ERROR';
                cell.display = '#ERROR';

                const cellElement = document.querySelector(`[data-id="${id}"]`);
                if (cellElement) {
                    cellElement.textContent = '#ERROR';
                }
            }
        }
    }

    // Process each dependent cell
    cellDependencies[cellId].forEach(depId => {
        processCell(depId);
    });
}

// Paste cell data with proper handling of relative and absolute references
function pasteCellData(targetCellId, clipboard) {
    if (!clipboard || !clipboard.data) return;

    const sourceCell = clipboard.cellId;
    const targetCell = targetCellId;

    // Calculate the offset between source and target
    const sourceCol = sourceCell.charCodeAt(0) - 65; // A=0, B=1, etc.
    const sourceRow = parseInt(sourceCell.substring(1)) - 1; // 0-based

    const targetCol = targetCell.charCodeAt(0) - 65;
    const targetRow = parseInt(targetCell.substring(1)) - 1;

    const colOffset = targetCol - sourceCol;
    const rowOffset = targetRow - sourceRow;

    // Create a new cell data object
    const newCellData = JSON.parse(JSON.stringify(clipboard.data));

    // If it's a formula, adjust relative references
    if (newCellData.type === 'formula') {
        const formula = newCellData.formula;

        // Process the formula to adjust cell references
        // This regex matches both absolute and relative cell references
        const adjustedFormula = formula.replace(/(\$?)([A-E])(\$?)([1-9][0]?)/g, function(match, colAbs, col, rowAbs, row) {
            if (colAbs && rowAbs) {
                // $A$1 format - fully absolute reference, don't change
                return match;
            }

            let newCol = col;
            let newRow = row;

            // Adjust column if not absolute
            if (!colAbs) {
                const colCharCode = col.charCodeAt(0) + colOffset;
                // Ensure we stay within valid column range (A-E)
                if (colCharCode >= 65 && colCharCode <= 69) {
                    newCol = String.fromCharCode(colCharCode);
                } else {
                    // Out of range - will show as #ERROR
                    return 'XX999'; // Invalid reference that will cause error
                }
            }

            // Adjust row if not absolute
            if (!rowAbs) {
                const newRowNum = parseInt(row) + rowOffset;
                // Ensure we stay within valid row range (1-20)
                if (newRowNum >= 1 && newRowNum <= 20) {
                    newRow = newRowNum.toString();
                } else {
                    // Out of range - will show as #ERROR
                    return 'XX999'; // Invalid reference that will cause error
                }
            }

            // Rebuild the reference with appropriate $ signs
            return `${colAbs}${newCol}${rowAbs}${newRow}`;
        });

        newCellData.formula = adjustedFormula;

        // Update dependencies for the new formula
        findDependencies(adjustedFormula.substring(1), targetCellId);

        // Evaluate the new formula
        try {
            const result = evaluateFormula(adjustedFormula.substring(1), targetCellId);
            newCellData.result = result;
            newCellData.display = isNaN(result) ? result : (Math.round(result * 1000) / 1000).toString();
        } catch (error) {
            newCellData.result = '#ERROR';
            newCellData.display = '#ERROR';
        }
    }

    // Update the cell data
    cellData[targetCellId] = newCellData;

    // Update the cell display
    const cell = document.querySelector(`[data-id="${targetCellId}"]`);
    cell.textContent = newCellData.display;

    // Set appropriate color
    if (newCellData.type === 'formula') {
        cell.style.color = '#0000CC';
    } else if (newCellData.type === 'text') {
        cell.style.color = '#008800';
    } else {
        cell.style.color = '#000000';
    }

    // Update the entry box if the target is the active cell
    if (targetCellId === activeCell) {
        const entryBox = document.getElementById('entryBox');
        if (newCellData.type === 'formula') {
            entryBox.value = newCellData.formula;
        } else {
            entryBox.value = newCellData.value;
        }
    }

    // Recalculate dependent cells if needed
    if (cellDependencies[targetCellId]) {
        recalculateDependentCells(targetCellId);
    }
}

// Initialize the spreadsheet when the page loads
window.onload = function() {
    createSpreadsheet();

    // Initialize the calculation engine
    initCalculationEngine();

    // Set first cell as active by default
    setActiveCell('A1');
};
