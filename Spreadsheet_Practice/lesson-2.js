// Lesson 2: Copying Formulas and Relative References
// Focuses on how to copy/paste formulas and understanding relative cell references
// Implemented using module pattern to avoid global variable conflicts

var Lesson2 = (function () {
  "use strict";

  // Private variables - no conflicts with other lessons
  var studentName = "student";
  var currentExerciseIndex = 0;
  var practiceButton;

  // Private lesson exercises
  var exercises = [
    {
      title: "Exercise 2.1: Creating a Growth Model Table",
      instruction: `<p>In this lesson, we'll learn about copying formulas, how relative references work, and some useful keyboard shortcuts.</p>
            <p>Let's create a table to track bacterial growth over time:</p>
            <ol>
                <li>Click on cell A1 and enter "Time" as the header for our time column</li>
                <li>Press the <strong>Tab</strong> key to complete the entry and move to cell B1</li>
                <li>Enter "Population" as the header for our population column</li>
                <li>Press the <strong>Enter/Return</strong> key to complete the entry and move down to cell B2</li>
                <li>Enter 100 in cell B2 (this represents the initial bacteria count)</li>
                <li>Click on cell A2</li>
                <li>Enter 0 in cell A2 (this represents the starting time in minutes)</li>
                <li>Click on cell D1</li>
                <li>Enter your name in cell D1 (this will be used to generate your verification code)</li>
            </ol>
            <p>Notice how keyboard shortcuts make navigating the spreadsheet much faster!</p>
            <p>This will be the foundation for our growth model. Click "Check Answer" when you're ready.</p>`,
      validate: function () {
        // Check if cells contain the correct values
        const timeHeader = getCellData("A1");
        const popHeader = getCellData("B1");
        const timeStart = getCellData("A2");
        const popStart = getCellData("B2");
        const nameCell = getCellData("D1");

        // Store the student's name for later use
        if (nameCell.type === "text" && nameCell.value.trim() !== "") {
          studentName = nameCell.value.trim();
        }

        return (
          timeHeader.type === "text" &&
          timeHeader.value.toLowerCase().includes("time") &&
          popHeader.type === "text" &&
          popHeader.value.toLowerCase().includes("population") &&
          timeStart.type === "number" &&
          timeStart.result === 0 &&
          popStart.type === "number" &&
          popStart.result === 100 &&
          nameCell.type === "text" &&
          nameCell.value.trim() !== ""
        );
      },
      getErrorMessage: function () {
        // More detailed error messages to help the student
        const timeHeader = getCellData("A1");
        const popHeader = getCellData("B1");
        const timeStart = getCellData("A2");
        const popStart = getCellData("B2");
        const nameCell = getCellData("D1");

        if (
          timeHeader.type !== "text" ||
          !timeHeader.value.toLowerCase().includes("time")
        ) {
          return "Please enter 'Time' as text in cell A1.";
        }

        if (
          popHeader.type !== "text" ||
          !popHeader.value.toLowerCase().includes("population")
        ) {
          return "Please enter 'Population' as text in cell B1.";
        }

        if (timeStart.type !== "number" || timeStart.result !== 0) {
          return "Please enter 0 (zero) as a number in cell A2 for the starting time.";
        }

        if (popStart.type !== "number" || popStart.result !== 100) {
          return "Please enter 100 as a number in cell B2 for the initial population.";
        }

        if (nameCell.type !== "text" || nameCell.value.trim() === "") {
          return "Please enter your name in cell D1.";
        }

        return "Please check all cells and try again.";
      },
      getSuccessMessage: function () {
        return `Great job, ${studentName}! You've set up the foundation for our bacterial growth model. We have a starting time of 0 minutes and an initial population of 100 bacteria.`;
      },
    },
    {
      title: "Exercise 2.2: Creating Time Increments",
      instruction: function () {
        return `
                <p>Now, ${studentName}, let's add the next time increment using a formula.</p>
                <p>We want to track the bacterial growth at 30-minute intervals:</p>
                <ol>
                    <li>Click on cell A3 (below the starting time)</li>
                    <li>Enter the formula <strong>=A2+30</strong></li>
                    <li>Press Enter/Return</li>
                </ol>
                <p>This formula adds 30 minutes to the previous time value, giving us our first time increment.</p>
                <p>Click the "Check Answer" button when done.</p>
            `;
      },
      validate: function () {
        // Check if cell A3 contains the correct formula
        const timeCell = getCellData("A3");

        // Must be a formula, specifically =A2+30, and result must be 30
        return (
          timeCell.type === "formula" &&
          timeCell.formula.toLowerCase().replace(/\s+/g, "") === "=a2+30" &&
          timeCell.result === 30
        );
      },
      getErrorMessage: function () {
        const timeCell = getCellData("A3");

        if (timeCell.type !== "formula") {
          return "Cell A3 should contain a formula. Make sure to start with an equals sign (=).";
        }

        if (timeCell.formula.toLowerCase().replace(/\s+/g, "") !== "=a2+30") {
          return "Please use the formula =A2+30 in cell A3 to add 30 minutes to the previous time.";
        }

        if (timeCell.result !== 30) {
          return "The formula isn't calculating correctly. Check that cell A2 contains 0 and you're adding 30.";
        }

        return "Something's not right with your formula. Try entering =A2+30 in cell A3 again.";
      },
      getSuccessMessage: function () {
        return `Excellent, ${studentName}! You've created a formula that adds 30 minutes to the previous time. Now cell A3 shows 30, representing 30 minutes from the start.`;
      },
    },
    {
      title: "Exercise 2.3: Modeling Population Growth",
      instruction: function () {
        return `
                <p>${studentName}, let's model bacterial growth at our first time interval.</p>
                <p>Bacteria grow rapidly - in our model, the population increases by 80% every 30 minutes.</p>
                <ol>
                    <li>Click on cell B3 (below the initial population)</li>
                    <li>Enter the formula <strong>=B2*1.8</strong></li>
                    <li>Press Enter/Return</li>
                </ol>
                <p>This formula multiplies the previous population by 1.8, representing an 80% increase.</p>
                <p>Observe that the result is 180 (100 * 1.8 = 180).</p>
                <p>Click the "Check Answer" button when done.</p>
            `;
      },
      validate: function () {
        // Check if cell B3 contains the correct formula
        const popCell = getCellData("B3");

        // Must be a formula, specifically =B2*1.8, and result must be 180
        return (
          popCell.type === "formula" &&
          popCell.formula.toLowerCase().replace(/\s+/g, "") === "=b2*1.8" &&
          Math.abs(popCell.result - 180) < 0.01
        );
      },
      getErrorMessage: function () {
        const popCell = getCellData("B3");

        if (popCell.type !== "formula") {
          return "Cell B3 should contain a formula. Make sure to start with an equals sign (=).";
        }

        if (popCell.formula.toLowerCase().replace(/\s+/g, "") !== "=b2*1.8") {
          return "Please use the formula =B2*1.8 in cell B3 to calculate an 80% population increase.";
        }

        if (Math.abs(popCell.result - 180) >= 0.01) {
          return "The formula isn't calculating correctly. Check that cell B2 contains 100 and you're multiplying by 1.8.";
        }

        return "Something's not right with your formula. Try entering =B2*1.8 in cell B3 again.";
      },
      getSuccessMessage: function () {
        return `Great work, ${studentName}! You've successfully modeled the first population increase. After 30 minutes, our initial 100 bacteria have grown to 180 bacteria, an 80% increase.`;
      },
    },
    {
      title: "Exercise 2.4: Extending the Model with Copy and Paste",
      instruction: function () {
        return `
                <p>Now, ${studentName}, we'll extend our model to track growth over multiple time intervals using copy and paste.</p>
                <p>We need to add 3 more rows to our table (for a total of 5 time points). In this spreadsheet, we need to copy and paste one cell at a time:</p>
                <p><strong>First, let's extend the time column:</strong></p>
                <ol>
                    <li>Click on cell A3 to select it</li>
                    <li>Copy the cell using Ctrl+C (or Command+C on Mac)</li>
                    <li>Click on cell A4</li>
                    <li>Paste the formula using Ctrl+V (or Command+V on Mac)</li>
                    <li>Press the <strong>Enter/Return</strong> key to move down to cell A5</li>
                    <li>Paste again with Ctrl+V (or Command+V on Mac)</li>
                    <li>Press <strong>Enter/Return</strong> again to move to A6 and paste once more</li>
                </ol>
                <p><strong>Next, let's extend the population column:</strong></p>
                <ol>
                    <li>Click on cell B3 to select it</li>
                    <li>Copy the cell using Ctrl+C (or Command+C on Mac)</li>
                    <li>Click on cell B4</li>
                    <li>Paste the formula using Ctrl+V (or Command+V on Mac)</li>
                    <li>Press the <strong>Enter/Return</strong> key to move down to cell B5</li>
                    <li>Paste again with Ctrl+V (or Command+V on Mac)</li>
                    <li>Press <strong>Enter/Return</strong> again to move to B6 and paste once more</li>
                </ol>
                <p><strong>Keyboard Tip:</strong> Using Enter to move down after pasting is more efficient than clicking on each cell!</p>
                <p><strong>Important:</strong> Notice how the formulas automatically adjust when copied! This is because spreadsheets use <strong>relative references</strong> by default.</p>
                <p>For example, when =A2+30 is copied from A3 to A4, it becomes =A3+30, automatically referring to the cell above it.</p>
                <p>Click "Check Answer" when you've extended your model through row 6.</p>
            `;
      },
      validate: function () {
        // Check if all time and population cells contain correct formulas and values
        // Row 4
        const time4 = getCellData("A4");
        const pop4 = getCellData("B4");

        // Row 5
        const time5 = getCellData("A5");
        const pop5 = getCellData("B5");

        // Row 6
        const time6 = getCellData("A6");
        const pop6 = getCellData("B6");

        // Expected values
        const expectedTimes = [60, 90, 120]; // A4, A5, A6
        const expectedPops = [324, 583.2, 1049.76]; // B4, B5, B6

        // Tolerance for floating-point calculations
        const tolerance = 0.01;

        // Check all formulas and results
        const time4Correct =
          time4.type === "formula" &&
          Math.abs(time4.result - expectedTimes[0]) < tolerance;

        const pop4Correct =
          pop4.type === "formula" &&
          Math.abs(pop4.result - expectedPops[0]) < tolerance;

        const time5Correct =
          time5.type === "formula" &&
          Math.abs(time5.result - expectedTimes[1]) < tolerance;

        const pop5Correct =
          pop5.type === "formula" &&
          Math.abs(pop5.result - expectedPops[1]) < tolerance;

        const time6Correct =
          time6.type === "formula" &&
          Math.abs(time6.result - expectedTimes[2]) < tolerance;

        const pop6Correct =
          pop6.type === "formula" &&
          Math.abs(pop6.result - expectedPops[2]) < tolerance;

        return (
          time4Correct &&
          pop4Correct &&
          time5Correct &&
          pop5Correct &&
          time6Correct &&
          pop6Correct
        );
      },
      getErrorMessage: function () {
        // Check each row individually for more specific error messages
        const time4 = getCellData("A4");
        const pop4 = getCellData("B4");

        // Row 5
        const time5 = getCellData("A5");
        const pop5 = getCellData("B5");

        // Row 6
        const time6 = getCellData("A6");
        const pop6 = getCellData("B6");

        // Expected values
        const expectedTimes = [60, 90, 120]; // A4, A5, A6
        const expectedPops = [324, 583.2, 1049.76]; // B4, B5, B6

        // Tolerance for floating-point calculations
        const tolerance = 0.01;

        // Row 4 checks
        if (time4.type !== "formula") {
          return "Cell A4 should contain a formula. Make sure you've copied and pasted from A3.";
        }

        if (Math.abs(time4.result - expectedTimes[0]) >= tolerance) {
          return "The time in cell A4 should be 60 minutes. Make sure you've correctly copied the formula from A3.";
        }

        if (pop4.type !== "formula") {
          return "Cell B4 should contain a formula. Make sure you've copied and pasted from B3.";
        }

        if (Math.abs(pop4.result - expectedPops[0]) >= tolerance) {
          return "The population in cell B4 should be about 324 bacteria. Make sure you've correctly copied the formula from B3.";
        }

        // Row 5 checks
        if (
          time5.type !== "formula" ||
          Math.abs(time5.result - expectedTimes[1]) >= tolerance
        ) {
          return "The time in cell A5 should be 90 minutes. Make sure you've extended your formulas correctly.";
        }

        if (
          pop5.type !== "formula" ||
          Math.abs(pop5.result - expectedPops[1]) >= tolerance
        ) {
          return "The population in cell B5 should be about 583.2 bacteria. Make sure you've extended your formulas correctly.";
        }

        // Row 6 checks
        if (
          time6.type !== "formula" ||
          Math.abs(time6.result - expectedTimes[2]) >= tolerance
        ) {
          return "The time in cell A6 should be 120 minutes. Make sure you've extended your formulas through row 6.";
        }

        if (
          pop6.type !== "formula" ||
          Math.abs(pop6.result - expectedPops[2]) >= tolerance
        ) {
          return "The population in cell B6 should be about 1049.76 bacteria. Make sure you've extended your formulas through row 6.";
        }

        return "Your table is not quite right. Please make sure you've copied the formulas correctly to rows 4, 5, and 6.";
      },
      getSuccessMessage: function () {
        return `Great work, ${studentName}! You've successfully extended your model through 120 minutes using copy and paste.
                <p>Your table now shows:</p>
                <ul>
                    <li>At 0 minutes: 100 bacteria (initial population)</li>
                    <li>At 30 minutes: 180 bacteria</li>
                    <li>At 60 minutes: 324 bacteria</li>
                    <li>At 90 minutes: 583.2 bacteria</li>
                    <li>At 120 minutes: 1049.76 bacteria</li>
                </ul>
                <p>Notice how quickly the bacteria population grows! In just 2 hours, it's more than 10 times the initial amount.</p>
                <p>More importantly, you've learned how <strong>relative references</strong> in formulas automatically adjust when copied to new locations. This is one of the most powerful features of spreadsheets, allowing you to easily extend calculations across many rows or columns.</p>`;
      },
    },
    {
      title: "Exercise 2.5: Exploring How Changes Propagate",
      instruction: function () {
        return `
                <p>One of the most powerful features of spreadsheets is that when you change a value that other cells depend on, all the dependent cells automatically update.</p>
                <p>Let's see this in action:</p>
                <ol>
                    <li>Click on cell B2 (our initial population of 100)</li>
                    <li>Change the value from 100 to 1000</li>
                    <li>Press Enter</li>
                </ol>
                <p>Observe how all the population values below automatically recalculate! This is because they all depend on B2 through their formulas.</p>
                <p>This automatic recalculation is what makes spreadsheets so powerful for modeling and what-if analysis.</p>
                <p>Click "Check Answer" when you've changed the initial population and observed the results.</p>
            `;
      },
      validate: function () {
        // Check if cell B2 now contains 1000 and other cells have been updated accordingly
        const initialPop = getCellData("B2");

        // Check subsequent cells
        const pop3 = getCellData("B3");
        const pop4 = getCellData("B4");
        const pop5 = getCellData("B5");
        const pop6 = getCellData("B6");

        // Expected values with initial population of 1000
        const expectedPops = [1800, 3240, 5832, 10497.6]; // B3, B4, B5, B6

        // Tolerance for floating-point calculations
        const tolerance = 0.1;

        // Check initial value
        const initialCorrect =
          initialPop.type === "number" &&
          Math.abs(initialPop.result - 1000) < tolerance;

        // Check that formulas have recalculated correctly
        const pop3Correct =
          pop3.type === "formula" &&
          Math.abs(pop3.result - expectedPops[0]) < tolerance;

        const pop4Correct =
          pop4.type === "formula" &&
          Math.abs(pop4.result - expectedPops[1]) < tolerance;

        const pop5Correct =
          pop5.type === "formula" &&
          Math.abs(pop5.result - expectedPops[2]) < tolerance;

        const pop6Correct =
          pop6.type === "formula" &&
          Math.abs(pop6.result - expectedPops[3]) < tolerance;

        return (
          initialCorrect &&
          pop3Correct &&
          pop4Correct &&
          pop5Correct &&
          pop6Correct
        );
      },
      getErrorMessage: function () {
        const initialPop = getCellData("B2");

        if (
          initialPop.type !== "number" ||
          Math.abs(initialPop.result - 1000) >= 0.1
        ) {
          return "Please change the initial population in cell B2 to 1000.";
        }

        // Check if formulas are still there but not calculating correctly
        const pop3 = getCellData("B3");
        if (pop3.type !== "formula") {
          return "It looks like the formula in cell B3 has been replaced. Please restore the formula =B2*1.8";
        }

        return "Something's not right with your spreadsheet. Make sure you've changed cell B2 to 1000 and all formulas are intact.";
      },
      getSuccessMessage: function () {
        // Generate verification code
        var verificationCode = "XXXXX";
        if (typeof window.makeVerification === "function") {
          verificationCode = window.makeVerification(studentName, 2);
        }

        return `Congratulations, ${studentName}! You've just experienced one of the most powerful aspects of spreadsheets - the automatic propagation of changes.
                <p>Your table now shows:</p>
                <ul>
                    <li>At 0 minutes: 1000 bacteria (initial population)</li>
                    <li>At 30 minutes: 1800 bacteria</li>
                    <li>At 60 minutes: 3240 bacteria</li>
                    <li>At 90 minutes: 5832 bacteria</li>
                    <li>At 120 minutes: 10497.6 bacteria</li>
                </ul>
                <p>By simply changing one value (the initial population), you've updated your entire model without having to recalculate each value manually!</p>
                <p>This feature makes spreadsheets incredibly useful for:</p>
                <ul>
                    <li>Testing different scenarios ("what if" analysis)</li>
                    <li>Updating reports when new data comes in</li>
                    <li>Creating models where values depend on each other</li>
                </ul>

                <p><strong>Your verification code for Lesson 2 is: ${verificationCode}</strong></p>
                <p>Please provide this code to your instructor to verify completion of this lesson.</p>

                <p>You've now mastered the basics of copying formulas and using relative references in spreadsheets. These skills will be essential as you build more complex models in future lessons.</p>`;
      },
    },
  ];

  // Private functions
  function showLessonIntroduction() {
    var introduction = `
        <div class="instruction-title">Lesson 2: Copying Formulas and Relative References</div>
        <p>Welcome to your second spreadsheet lesson! In this lesson, you'll learn:</p>
        <ul>
            <li>How to copy and paste formulas</li>
            <li>How relative cell references work</li>
            <li>How to create a time-based growth model</li>
            <li>Useful keyboard shortcuts for efficient spreadsheet navigation</li>
        </ul>
        <p>One of the most powerful features of spreadsheets is the ability to create a formula once and then copy it to multiple cells. When you copy a formula, the cell references in the formula automatically adjust based on the new location - these are called <strong>relative references</strong>.</p>
        <p>For example, if cell B3 contains the formula <code>=B2*2</code> and you copy it to cell B4, the formula will automatically change to <code>=B3*2</code>.</p>
        <p>In this lesson, we'll use this feature to model bacterial growth over time, creating a table that calculates both time increments and population changes. Along the way, you'll also learn keyboard shortcuts that will make you more efficient with spreadsheets:</p>
        <ul>
            <li><strong>Enter/Return</strong>: Complete entry and move down</li>
            <li><strong>Tab</strong>: Complete entry and move right</li>
            <li><strong>Arrow keys</strong>: Navigate between cells</li>
            <li><strong>Ctrl+C / Command+C</strong>: Copy selected cell</li>
            <li><strong>Ctrl+V / Command+V</strong>: Paste into current cell</li>
        </ul>
        <p>Click "Start Exercises" below to begin!</p>
    `;

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
    } else if (buttonState === "Check Answer") {
      var currentExercise = exercises[currentExerciseIndex];

      if (currentExercise.validate()) {
        if (currentExercise.getSuccessMessage) {
          window.showFeedback(currentExercise.getSuccessMessage(), "success");
        } else {
          window.showFeedback("Correct! Great job!", "success");
        }

        currentExerciseIndex++;

        if (currentExerciseIndex < exercises.length) {
          practiceButton.textContent = "Continue";
        } else {
          practiceButton.textContent = "Next Lesson";
        }
      } else {
        if (currentExercise.getErrorMessage) {
          window.showFeedback(currentExercise.getErrorMessage(), "error");
        } else {
          window.showFeedback("Not quite right. Please try again.", "error");
        }
      }
    } else if (buttonState === "Continue") {
      if (currentExerciseIndex < exercises.length) {
        showExercise(currentExerciseIndex);
        practiceButton.textContent = "Check Answer";
      } else {
        practiceButton.textContent = "Next Lesson";
      }
    } else if (buttonState === "Next Lesson") {
      var lessonButtons = document.querySelectorAll(".lesson-button");
      if (lessonButtons.length >= 3) {
        lessonButtons[2].click();
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

    if (typeof content === "function") {
      content = content();
    }

    window.updateInstructions(content, exercise.title);
    document.getElementById("feedbackArea").innerHTML = "";
  }

  // Public API
  return {
    init: function () {
      console.log("Initializing Lesson 2");

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
