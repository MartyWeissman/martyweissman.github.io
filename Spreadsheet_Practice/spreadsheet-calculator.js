// Spreadsheet calculation engine
// Handles formula evaluation, dependency tracking, and recalculation

// Set cell value through calculation engine
function setCellValue(cellId, inputValue) {
    const value = inputValue.trim();

    // Determine the type of the value
    let type, displayValue, result;

    if (value === '') {
        type = 'null';
        displayValue = '';
        result = '';

        // Clear dependencies if cell was previously a formula
        if (getCellData(cellId).type === 'formula') {
            clearDependencies(cellId);
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
        if (getCellData(cellId).type === 'formula') {
            clearDependencies(cellId);
        }
    } else {
        type = 'text';
        displayValue = value;
        result = value;

        // Clear dependencies if cell was previously a formula
        if (getCellData(cellId).type === 'formula') {
            clearDependencies(cellId);
        }
    }

    // Update cell data
    setCellDataDirectly(cellId, type, value, type === 'formula' ? value : '', displayValue, result);

    // Update the cell display immediately
    updateCellDisplay(cellId);

    // Debug info
    console.log(`Cell ${cellId} updated to ${value}`);
    console.log(`Dependencies for ${cellId}:`, reverseDependencyGraph[cellId] || 'none');
    console.log(`Cells depending on ${cellId}:`, dependencyGraph[cellId] || 'none');

    // Recalculate all formulas in the correct order
    calculateAllFormulas();
}

// Clear dependencies for a cell
function clearDependencies(cellId) {
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

// Extract cell references from a formula
function extractCellReferences(formula) {
    const refs = [];
    console.log(`Extracting cell references from formula: ${formula}`);

    // First, check for range notations (A1:B5) and expand them
    const rangePattern = /([A-E])([1-9][0-9]?|20):([A-E])([1-9][0-9]?|20)/g;
    let rangeMatch;

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
    // Improved pattern to better match cell references like A10, B20, etc.
    const cellRefPattern = /([A-E])([1-9][0-9]?|20)/g;
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

// Evaluate a formula
function evaluateFormula(formula, currentCellId) {
    console.log(`Evaluating formula for ${currentCellId}: ${formula}`);

    // Remove all spaces to avoid issues with references
    const formulaWithoutSpace = formula.replace(/\s+/g, '');

    // Check for SUM and AVERAGE functions first
    const sumPattern = /SUM\(([A-E])([1-9][0-9]?|20):([A-E])([1-9][0-9]?|20)\)/g;
    const avgPattern = /AVERAGE\(([A-E])([1-9][0-9]?|20):([A-E])([1-9][0-9]?|20)\)/g;

    // Process SUM function
    if (formulaWithoutSpace.includes('SUM(')) {
        let sumFormula = formulaWithoutSpace;
        let rangeFound = false;

        sumFormula = sumFormula.replace(sumPattern, function(match, startCol, startRow, endCol, endRow) {
            rangeFound = true;
            const startCell = startCol + startRow;
            const endCell = endCol + endRow;
            // Calculate the SUM value - dependency tracking is now handled by extractCellReferences
            return calculateRangeFunction(startCell, endCell, 'SUM', currentCellId);
        });

        // If there was a SUM function, evaluate the resulting formula
        if (rangeFound) {
            return evaluateFormula(sumFormula, currentCellId);
        }
    }

    // Process AVERAGE function
    if (formulaWithoutSpace.includes('AVERAGE(')) {
        let avgFormula = formulaWithoutSpace;
        let rangeFound = false;

        avgFormula = avgFormula.replace(avgPattern, function(match, startCol, startRow, endCol, endRow) {
            rangeFound = true;
            const startCell = startCol + startRow;
            const endCell = endCol + endRow;
            // Calculate the AVERAGE value - dependency tracking is now handled by extractCellReferences
            return calculateRangeFunction(startCell, endCell, 'AVERAGE', currentCellId);
        });

        // If there was an AVERAGE function, evaluate the resulting formula
        if (rangeFound) {
            return evaluateFormula(avgFormula, currentCellId);
        }
    }

    // Check for implicit multiplication with cell references (like 5A1 instead of 5*A1)
    const implicitMultPattern = /(\d+)([A-E]([1-9][0-9]?|20))/g;
    if (implicitMultPattern.test(formulaWithoutSpace)) {
        throw new Error('Implicit multiplication not allowed (e.g., use 5*A1 instead of 5A1)');
    }

    // Check for implicit multiplication with parentheses (like 5(A1+A2) instead of 5*(A1+A2))
    const implicitParenPattern = /(\d+)(\()/g;
    if (implicitParenPattern.test(formulaWithoutSpace)) {
        throw new Error('Implicit multiplication not allowed (e.g., use 5*(A1+A2) instead of 5(A1+A2))');
    }

    // Replace cell references with their values - support for both absolute and relative references
    // Improved pattern to better handle cell references
    const cellRefPattern = /(\$?)([A-E])(\$?)([1-9][0-9]?|20)/g;
    let processedFormula = formulaWithoutSpace;

    // Create a temporary version with placeholders to avoid conflicts during replacement
    let tempFormula = formulaWithoutSpace;
    const replacements = [];
    let replacementIndex = 0;

    // First pass: collect all references and create placeholders
    tempFormula = tempFormula.replace(cellRefPattern, function(match, colAbs, col, rowAbs, row) {
        const cellRef = (colAbs === '$' ? colAbs : '') + col + (rowAbs === '$' ? rowAbs : '') + row;
        const placeholder = `__CELL_REF_${replacementIndex}__`;
        replacements.push({ placeholder, cellRef });
        replacementIndex++;
        return placeholder;
    });

    // Second pass: replace placeholders with values
    for (const replacement of replacements) {
        const { placeholder, cellRef } = replacement;

        // Extract actual cell ID (without $ signs)
        const actualCellRef = cellRef.replace(/\$/g, '');

        console.log(`Processing cell reference: ${actualCellRef} (from ${cellRef})`);

        // Prevent circular references
        if (actualCellRef === currentCellId) {
            throw new Error('Circular reference detected');
        }

        // Get the value from the referenced cell
        const refCellData = getCellData(actualCellRef);
        console.log(`Cell ${actualCellRef} data:`, refCellData);

        const refCellValue = refCellData.result;
        console.log(`Cell ${actualCellRef} value:`, refCellValue);

        // Handle empty cells
        if (refCellValue === '' || refCellValue === undefined || refCellValue === null) {
            throw new Error(`Cell ${actualCellRef} is empty`);
        }

        // Check if the value is a number or can be parsed as one
        if (typeof refCellValue === 'number') {
            tempFormula = tempFormula.replace(placeholder, refCellValue);
        } else if (typeof refCellValue === 'string' && !isNaN(refCellValue) && !isNaN(parseFloat(refCellValue))) {
            tempFormula = tempFormula.replace(placeholder, parseFloat(refCellValue));
        } else {
            throw new Error(`Cell ${actualCellRef} does not contain a number: ${refCellValue}`);
        }
    }

    processedFormula = tempFormula;
    console.log(`Processed formula: ${processedFormula}`);

    // Basic validation to ensure only allowed characters
    if (!/^[0-9+\-*/().]+$/.test(processedFormula)) {
        throw new Error(`Formula contains invalid characters: ${processedFormula}`);
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
        throw new Error('Error evaluating formula: ' + error.message);
    }
}

// Calculate all formulas in the correct order
function calculateAllFormulas() {
    // Store previous display values to check for changes
    const previousDisplays = {};
    for (const cellId in cellData) {
        previousDisplays[cellId] = getCellData(cellId).display;
    }

    // Get a calculation order that respects dependencies
    const calculationOrder = getCalculationOrder();

    // Debug the calculation order
    console.log('Calculation order:', calculationOrder);

    // Calculate each cell in the determined order
    for (const cellId of calculationOrder) {
        console.log(`Calculating formula in ${cellId}: ${getCellData(cellId).formula}`);
        try {
            const cellInfo = getCellData(cellId);
            if (cellInfo.type !== 'formula') continue;

            const result = evaluateFormula(cellInfo.formula.substring(1), cellId);
            const displayValue = isNaN(result) ? result : (Math.round(result * 1000) / 1000).toString();

            // Update the result and display value
            setCellDataDirectly(
                cellId,
                cellInfo.type,
                cellInfo.value,
                cellInfo.formula,
                displayValue,
                result
            );

            console.log(`${cellId} result: ${displayValue}`);
        } catch (error) {
            console.error(`Error calculating ${cellId}: ${error.message}`);
            const cellInfo = getCellData(cellId);

            // Update with error
            setCellDataDirectly(
                cellId,
                cellInfo.type,
                cellInfo.value,
                cellInfo.formula,
                '#ERROR',
                '#ERROR'
            );
        }
    }

    // Update displays for cells that changed
    updateAllCellDisplays(previousDisplays);
}
