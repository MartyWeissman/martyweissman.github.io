// Main initialization file for the spreadsheet
// Coordinates the loading and initialization of all components

// Initialize the spreadsheet application
function initializeSpreadsheet() {
    // Initialize the calculation engine
    initCalculationEngine();

    // Initialize the UI
    initializeUI();

    console.log('Spreadsheet initialized successfully');
}

// Start the application when the page loads
window.onload = function() {
    initializeSpreadsheet();
};
