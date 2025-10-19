# Module Pattern Documentation for Spreadsheet Practice Tool

## Overview

All lesson files in this project use the **Module Pattern** (also known as the Immediately Invoked Function Expression or IIFE pattern) to organize code and prevent global namespace pollution. This approach ensures that lessons can coexist without variable conflicts and provides better cross-browser compatibility.

## What is the Module Pattern?

The Module Pattern wraps all code in a self-contained function that executes immediately and returns a public API. This creates a closure that keeps internal variables and functions private while exposing only the necessary methods.

### Basic Structure

```javascript
var LessonX = (function () {
  "use strict";

  // Private variables (not accessible outside)
  var privateVariable = "value";
  
  // Private functions
  function privateFunction() {
    // Implementation
  }
  
  // Public API (what's accessible from outside)
  return {
    init: function() {
      // Initialize the lesson
    },
    
    publicMethod: function() {
      // Accessible from outside
    }
  };
})();
```

## Why Use the Module Pattern?

### 1. Avoids Global Variable Conflicts
Without the module pattern, each lesson might declare variables like `studentName`, `currentExerciseIndex`, and `practiceButton`. If multiple lessons are loaded, these would conflict.

**Problem (without module pattern):**
```javascript
// lesson-1.js
var studentName = "student";  // Global variable

// lesson-2.js
var studentName = "student";  // Conflicts with lesson-1!
```

**Solution (with module pattern):**
```javascript
// lesson-1.js
var Lesson1 = (function() {
  var studentName = "student";  // Private to Lesson1
  // ...
})();

// lesson-2.js
var Lesson2 = (function() {
  var studentName = "student";  // Private to Lesson2, no conflict!
  // ...
})();
```

### 2. Cross-Browser Compatibility
The module pattern uses traditional JavaScript (ES5) features that work in all browsers, including older versions. This is more reliable than ES6 modules which may have compatibility issues.

### 3. Clear Public Interface
Each lesson explicitly defines what methods are available to the outside world through the `return` statement.

### 4. Encapsulation
Internal implementation details are hidden, making the code more maintainable and preventing accidental modifications.

## Lesson Module Structure

Each lesson follows this standardized structure:

```javascript
// Lesson X: [Title]
// [Description]
// Implemented using module pattern to avoid global variable conflicts

var LessonX = (function () {
  "use strict";

  // ============================================
  // PRIVATE VARIABLES
  // ============================================
  var studentName = "student";
  var currentExerciseIndex = 0;
  var practiceButton;

  // ============================================
  // PRIVATE DATA: EXERCISES ARRAY
  // ============================================
  var exercises = [
    {
      title: "Exercise X.Y: [Title]",
      instruction: `[HTML content]` or function() { return `[HTML content]`; },
      validate: function () {
        // Return true if answer is correct, false otherwise
        return /* validation logic */;
      },
      getErrorMessage: function () {
        // Return specific error message
        return "Error message";
      },
      getSuccessMessage: function () {
        // Return success message
        return `Success message for ${studentName}`;
      },
    },
    // More exercises...
  ];

  // ============================================
  // PRIVATE FUNCTIONS
  // ============================================
  function showLessonIntroduction() {
    var introduction = `[HTML content]`;
    window.updateInstructions(introduction);
    
    practiceButton = document.getElementById("practiceButton");
    if (practiceButton) {
      practiceButton.textContent = "Start Exercises";
      practiceButton.style.display = "block";
    }
  }

  function setupPracticeButton() {
    practiceButton = document.getElementById("practiceButton");
    
    if (practiceButton) {
      // Clone and replace to remove old event listeners
      var newButton = practiceButton.cloneNode(true);
      practiceButton.parentNode.replaceChild(newButton, practiceButton);
      practiceButton = newButton;
      
      practiceButton.addEventListener("click", handlePracticeButtonClick);
    }
  }

  function handlePracticeButtonClick() {
    var buttonState = practiceButton.textContent;

    if (buttonState === "Start Exercises") {
      currentExerciseIndex = 0;
      showExercise(currentExerciseIndex);
      practiceButton.textContent = "Check Answer";
    } 
    else if (buttonState === "Check Answer") {
      var currentExercise = exercises[currentExerciseIndex];

      if (currentExercise.validate()) {
        // Show success message
        if (currentExercise.getSuccessMessage) {
          window.showFeedback(currentExercise.getSuccessMessage(), "success");
        }
        
        currentExerciseIndex++;

        if (currentExerciseIndex < exercises.length) {
          practiceButton.textContent = "Continue";
        } else {
          practiceButton.textContent = "Next Lesson"; // or "Finish" for last lesson
        }
      } 
      else {
        // Show error message
        if (currentExercise.getErrorMessage) {
          window.showFeedback(currentExercise.getErrorMessage(), "error");
        }
      }
    } 
    else if (buttonState === "Continue") {
      if (currentExerciseIndex < exercises.length) {
        showExercise(currentExerciseIndex);
        practiceButton.textContent = "Check Answer";
      }
    } 
    else if (buttonState === "Next Lesson") {
      // Navigate to next lesson
      var lessonButtons = document.querySelectorAll(".lesson-button");
      if (lessonButtons.length >= X+1) {
        lessonButtons[X].click(); // Click next lesson button
      }
    }
  }

  function showExercise(index) {
    if (index < 0 || index >= exercises.length) {
      console.error("Exercise index " + index + " is out of range");
      return;
    }

    var exercise = exercises[index];
    var content = exercise.instruction;

    // Support dynamic instructions
    if (typeof content === "function") {
      content = content();
    }

    window.updateInstructions(content, exercise.title);
    document.getElementById("feedbackArea").innerHTML = "";
  }

  // ============================================
  // PUBLIC API
  // ============================================
  return {
    init: function () {
      console.log("Initializing Lesson X");

      clearSpreadsheet();
      studentName = "student";

      showLessonIntroduction();
      setupPracticeButton();
    },

    getStudentName: function () {
      return studentName;
    },
  };
})();
```

## How Lessons are Loaded

### 1. Static Loading in HTML

All lesson scripts are loaded statically in `Spreadsheet_Practice.html`:

```html
<!-- Load all lesson scripts statically -->
<script src="lesson-1.js"></script>
<script src="lesson-2.js"></script>
<script src="lesson-3.js"></script>
<script src="lesson-4.js"></script>
<script src="lesson-5.js"></script>
```

This ensures all lesson modules are available immediately when the page loads.

### 2. Initialization via guide.js

The `guide.js` file handles lesson navigation and initialization:

```javascript
function loadLesson(lessonNumber) {
  console.log(`Loading lesson ${lessonNumber}`);
  clearSpreadsheet();

  try {
    if (lessonNumber === 1 && typeof Lesson1 !== "undefined") {
      Lesson1.init();
      showFeedback(`Lesson ${lessonNumber} loaded successfully!`, "success");
    } 
    else if (lessonNumber === 2 && typeof Lesson2 !== "undefined") {
      Lesson2.init();
      showFeedback(`Lesson ${lessonNumber} loaded successfully!`, "success");
    }
    // ... etc for other lessons
  } catch (e) {
    showFeedback(`Error loading lesson ${lessonNumber}: ${e.message}`, "error");
  }
}
```

### 3. Navigation Flow

1. User clicks a lesson button in the navigation bar
2. `guide.js` calls `loadLesson(n)`
3. The appropriate `LessonN.init()` method is called
4. The lesson module:
   - Clears the spreadsheet
   - Resets internal state
   - Shows the lesson introduction
   - Sets up the practice button

## Global Functions Available to Lessons

Lessons have access to these global functions defined in other scripts:

### From guide.js:
- `window.updateInstructions(content, title)` - Update the instruction panel
- `window.showFeedback(message, type)` - Show feedback messages

### From spreadsheet-core.js:
- `getCellData(cellId)` - Get cell data object
- `getCellValue(cellId)` - Get cell display value
- `clearSpreadsheet()` - Clear all cells

### From verification.js:
- `window.makeVerification(name, lessonNum)` - Generate verification code

## Adding a New Lesson

To add a new lesson (e.g., Lesson 6):

### Step 1: Create the Lesson File

Create `lesson-6.js` following the module pattern structure:

```javascript
var Lesson6 = (function () {
  "use strict";

  var studentName = "student";
  var currentExerciseIndex = 0;
  var practiceButton;

  var exercises = [
    // Define your exercises
  ];

  // Define private functions (showLessonIntroduction, setupPracticeButton, etc.)

  return {
    init: function () {
      console.log("Initializing Lesson 6");
      clearSpreadsheet();
      studentName = "student";
      showLessonIntroduction();
      setupPracticeButton();
    },
    getStudentName: function () {
      return studentName;
    },
  };
})();
```

### Step 2: Add Script Tag to HTML

In `Spreadsheet_Practice.html`, add:

```html
<script src="lesson-6.js"></script>
```

### Step 3: Update guide.js

In the `loadLesson()` function, add:

```javascript
else if (lessonNumber === 6 && typeof Lesson6 !== "undefined") {
  Lesson6.init();
  showFeedback(`Lesson ${lessonNumber} loaded successfully!`, "success");
}
```

In the `createNavigation()` function, update the loop:

```javascript
for (let i = 1; i <= 6; i++) {  // Change 5 to 6
  // ...
}
```

### Step 4: Update Lesson 5 Navigation

In `lesson-5.js`, update the final exercise's button behavior to navigate to Lesson 6 instead of showing help.

## Best Practices

### 1. Use ES5 Syntax
- Use `var` instead of `let` or `const`
- Use traditional function declarations
- Avoid arrow functions `() =>`
- Use `function() {}` instead

### 2. Always Use "use strict"
Start each module with `"use strict";` to catch common errors.

### 3. Clone Event Listeners
Always clone and replace buttons to remove old event listeners:

```javascript
var newButton = practiceButton.cloneNode(true);
practiceButton.parentNode.replaceChild(newButton, practiceButton);
practiceButton = newButton;
```

### 4. Reset State in init()
Always reset lesson state when `init()` is called:

```javascript
init: function () {
  clearSpreadsheet();
  studentName = "student";
  currentExerciseIndex = 0;
  // ...
}
```

### 5. Dynamic Instructions
Use function-based instructions when you need to reference variables:

```javascript
instruction: function() {
  return `Hello ${studentName}, please complete this exercise.`;
}
```

### 6. Error Handling
Always provide specific error messages to guide students:

```javascript
getErrorMessage: function() {
  const cell = getCellData('A1');
  
  if (cell.type !== 'number') {
    return "Cell A1 should contain a number.";
  }
  
  if (cell.result !== 42) {
    return "The value in A1 should be 42.";
  }
  
  return "Please check your answer and try again.";
}
```

## Testing Your Module

### Check Module is Defined
Open browser console and type:
```javascript
typeof LessonX
// Should return: "object"
```

### Check Public Methods
```javascript
LessonX.init
// Should return: function

LessonX.getStudentName
// Should return: function
```

### Test Initialization
```javascript
LessonX.init()
// Should initialize the lesson
```

### Check for Conflicts
Load multiple lessons and verify no console errors appear.

## Troubleshooting

### Issue: "LessonX is not defined"
- Verify the script is loaded in HTML
- Check for syntax errors in the lesson file
- Ensure the module returns an object

### Issue: Variables from one lesson affecting another
- Verify you're using the module pattern correctly
- Check that all variables are declared inside the IIFE
- Ensure you're not creating global variables accidentally

### Issue: Event listeners not working
- Make sure you're cloning and replacing the button
- Verify addEventListener is called after the button is replaced
- Check that the button ID exists in the DOM

### Issue: Cross-browser compatibility problems
- Avoid ES6+ features (arrow functions, let/const, template literals in older browsers)
- Test in multiple browsers
- Use polyfills if necessary

## Summary

The module pattern provides:
- ✅ **Namespace isolation** - No variable conflicts between lessons
- ✅ **Cross-browser compatibility** - Works in all browsers
- ✅ **Encapsulation** - Private variables and functions
- ✅ **Clear public API** - Explicit interface for each lesson
- ✅ **Maintainability** - Easy to add, modify, or remove lessons
- ✅ **Predictable behavior** - Each lesson is self-contained

By following this pattern consistently across all lessons, we ensure a robust, scalable, and maintainable codebase.