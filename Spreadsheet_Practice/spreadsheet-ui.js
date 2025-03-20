// Spreadsheet UI and event handling
// Manages grid creation, event handling, and visual updates

// UI state variables
let activeCell = null;
let navigationMode = true;
let clipboard = null;  // For copy/paste functionality

// Create the spreadsheet grid
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

            // Initialize cell data in the data model
            if (!cellData[cellId]) {
                setCellDataDirectly(cellId, 'null', '', '', '', '');
            }

            dataRow.appendChild(cell);
        }

        spreadsheet.appendChild(dataRow);
    }

    // Set up event handlers
    setupEventListeners();

    // Add Clear button to UI
    addClearButton();
}

// Only the addClearButton function needs to change
function addClearButton() {
    const entryBoxContainer = document.querySelector('.entry-box-container');

    // Adjust entry box width to make room for the button
    const entryBox = document.getElementById('entryBox');
    if (entryBox) {
        entryBox.style.flex = '0.85';  // Slightly narrower
    }

    // Create Clear button
    const clearButton = document.createElement('button');
    clearButton.id = 'clearSpreadsheetButton';
    clearButton.className = 'clear-button';
    clearButton.textContent = 'Clear All';
    clearButton.title = 'Clear all spreadsheet data';
    clearButton.addEventListener('click', clearSpreadsheet);

    // Add to the container
    entryBoxContainer.appendChild(clearButton);
}

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

    // Display confirmation message if feedback area exists
    const feedbackArea = document.getElementById('feedbackArea');
    if (feedbackArea) {
        feedbackArea.innerHTML = '<p class="success-message">Spreadsheet cleared successfully.</p>';
    }

    console.log('Spreadsheet cleared');
}

// Set up event listeners for user interaction
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
                setCellValue(activeCell, this.value);
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
                setCellValue(activeCell, this.value);
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
            this.value = getCellData(activeCell).value;
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
    const cellInfo = getCellData(activeCell);

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

// Clear the active cell
function clearActiveCell() {
    if (!activeCell) return;

    clearCellData(activeCell);

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

// Update cell UI with current data
function updateCellDisplay(cellId) {
    const cell = document.querySelector(`[data-id="${cellId}"]`);
    if (!cell) return;

    const cellInfo = getCellData(cellId);

    // Update the cell display
    cell.textContent = cellInfo.display;

    // Visual styling based on type
    if (cellInfo.type === 'formula') {
        cell.style.color = '#0000CC';  // Dark blue for formulas
    } else if (cellInfo.type === 'text') {
        cell.style.color = '#008800';  // Green for text
    } else {
        cell.style.color = '#000000';  // Black for numbers and null
    }
}

// Update all cell displays that need updating
function updateAllCellDisplays(previousDisplays) {
    for (const cellId in cellData) {
        if (cellData[cellId].display !== previousDisplays[cellId]) {
            console.log(`Updating display of ${cellId} from "${previousDisplays[cellId]}" to "${cellData[cellId].display}"`);
            updateCellDisplay(cellId);
        }
    }
}

// Initialize the spreadsheet UI
function initializeUI() {
    createSpreadsheet();
    setActiveCell('A1');
}
