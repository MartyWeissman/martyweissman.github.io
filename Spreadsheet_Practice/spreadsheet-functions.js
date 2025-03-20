// Spreadsheet functions implementation
// Contains built-in functions like SUM and AVERAGE

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

            // Get data for this cell
            const cellInfo = getCellData(cellId);
            const cellValue = cellInfo.result;

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

// Paste cell data with proper handling of relative and absolute references
function pasteCellData(targetCellId, clipboard) {
  if (!clipboard || !clipboard.data) return;

  console.log(`Pasting from ${clipboard.cellId} to ${targetCellId}`);

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
      console.log(`Adjusting formula: ${formula}`);

      // Process the formula to adjust cell references
      // This regex matches both absolute and relative cell references
      const adjustedFormula = formula.replace(/(\$?)([A-E])(\$?)([1-9]|1[0-9]|20)\b/g, function(match, colAbs, col, rowAbs, row) {
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

      console.log(`Adjusted formula: ${adjustedFormula}`);
      newCellData.formula = adjustedFormula;

      // Update dependencies for the new formula
      trackDependencies(targetCellId, adjustedFormula.substring(1));

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
  updateCellData(targetCellId, newCellData);

  // Update the cell display
  updateCellDisplay(targetCellId);

  // Update the entry box if the target is the active cell
  if (targetCellId === activeCell) {
      const entryBox = document.getElementById('entryBox');
      if (newCellData.type === 'formula') {
          entryBox.value = newCellData.formula;
      } else {
          entryBox.value = newCellData.value;
      }
  }

  // Recalculate all formulas in the correct order
  calculateAllFormulas();
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
  const allCells = Object.keys(cellData).filter(cellId => {
      const cell = getCellData(cellId);
      return cell.type !== 'null' && cell.value !== '';
  });

  // Only process formula cells for our calculation
  const formulaCells = allCells.filter(cellId => getCellData(cellId).type === 'formula');

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
              const cellInfo = getCellData(depOnCell);
              if (!cellInfo || cellInfo.type === 'null' || cellInfo.value === '') {
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
      if (getCellData(cellId).type === 'formula') {
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
