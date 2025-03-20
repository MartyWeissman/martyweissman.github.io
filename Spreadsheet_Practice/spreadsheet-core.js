// Core cell data management and basic operations
// Handles data structures and cell operations independent of UI

// Cell data storage
const cellData = {};

// Store cell dependencies - which cells depend on which other cells
const dependencyGraph = {};

// Store reverse dependencies - which cells a formula depends on
const reverseDependencyGraph = {};

// Clear dependency graphs
function clearDependencyGraphs() {
    for (const key in dependencyGraph) {
        delete dependencyGraph[key];
    }
    for (const key in reverseDependencyGraph) {
        delete reverseDependencyGraph[key];
    }
}

// Initialize the calculation system
function initCalculationEngine() {
    clearDependencyGraphs();
}

// Get cell data
function getCellData(cellId) {
    if (cellData[cellId]) {
        return cellData[cellId];
    }
    return {
        type: 'null',
        value: '',
        formula: '',
        display: '',
        result: ''
    };
}

// Get cell value (as displayed)
function getCellValue(cellId) {
    if (cellData[cellId]) {
        return cellData[cellId].display;
    }
    return '';
}

// Get cell result (for calculations)
function getCellResult(cellId) {
    if (cellData[cellId]) {
        return cellData[cellId].result;
    }
    return '';
}

// Update cell data (internal function)
function updateCellData(cellId, data) {
    cellData[cellId] = data;
}

// Set a cell as a specific type with provided value
function setCellDataDirectly(cellId, type, value, formula, display, result) {
    cellData[cellId] = {
        type: type,
        value: value,
        formula: formula,
        display: display,
        result: result
    };
}

// Clear a cell's data completely
function clearCellData(cellId) {
    // Reset cell data to null state
    cellData[cellId] = {
        type: 'null',
        value: '',
        formula: '',
        display: '',
        result: ''
    };

    // Clear dependencies
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
