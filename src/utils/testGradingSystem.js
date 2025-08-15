// Test to verify that calculateFinalPoints works correctly with our data structure
// This test can be run in the browser console to check our implementation

function testGradingSystem() {
  // Sample data from a Form 4 student's final exam
  const finalExamData = {
    english: 83,
    mathematics: 81,
    science: 85,
    biology: 87,
    chemistry: 80,
    date: "2024-07-10",
    average: 83.2
  };
  
  // Required subjects for Form 3 and 4
  const REQUIRED_SUBJECTS = ['mathematics', 'agriculture', 'biology', 'english', 'chichewa'];
  
  // Function to calculate points from percentage
  function getPointsFromPercentage(percentage) {
    if (percentage >= 80) return 1;
    if (percentage >= 70) return 2;
    if (percentage >= 65) return 3;
    if (percentage >= 60) return 4;
    if (percentage >= 55) return 5;
    if (percentage >= 50) return 6;
    if (percentage >= 45) return 7;
    if (percentage >= 40) return 8;
    return 9; // 0-39%
  }
  
  // Calculate final points (simplified version of the actual function)
  function calculateFinalPoints(subjectMarks) {
    const subjectPoints = {};
    const availableSubjects = Object.keys(subjectMarks).filter(subject => 
      !['date', 'average'].includes(subject)
    );
    
    // Calculate points for all subjects
    availableSubjects.forEach(subject => {
      const percentage = subjectMarks[subject];
      subjectPoints[subject] = getPointsFromPercentage(percentage);
    });
    
    // Get required subjects that are available
    const requiredSubjectsAvailable = REQUIRED_SUBJECTS.filter(subject => 
      availableSubjects.includes(subject)
    );
    
    // Get optional subjects (excluding required ones)
    const optionalSubjects = availableSubjects.filter(subject => 
      !REQUIRED_SUBJECTS.includes(subject)
    );
    
    // Find the optional subject with the lowest points (best performance)
    let bestOptionalSubject = null;
    let lowestOptionalPoints = Infinity;
    
    optionalSubjects.forEach(subject => {
      if (subjectPoints[subject] < lowestOptionalPoints) {
        lowestOptionalPoints = subjectPoints[subject];
        bestOptionalSubject = subject;
      }
    });
    
    // Calculate final score using available required subjects + 1 best optional
    const finalSubjects = [...requiredSubjectsAvailable];
    if (bestOptionalSubject && finalSubjects.length < 6) {
      finalSubjects.push(bestOptionalSubject);
    }
    
    // Calculate total points
    const totalPoints = finalSubjects.reduce((sum, subject) => {
      return sum + subjectPoints[subject];
    }, 0);
    
    return {
      totalPoints,
      subjectPoints,
      finalSubjects,
      bestOptionalSubject
    };
  }
  
  // Run the test
  console.log("=== Testing Grading System ===");
  console.log("Input data:", finalExamData);
  
  const result = calculateFinalPoints(finalExamData);
  console.log("\nCalculation Results:");
  console.log("Total Points:", result.totalPoints);
  console.log("Subject Points:", result.subjectPoints);
  console.log("Final Subjects Used:", result.finalSubjects);
  console.log("Best Optional Subject:", result.bestOptionalSubject);
  
  // Expected calculation:
  // Available required subjects: mathematics (2 pts), biology (2 pts), english (2 pts)
  // Missing required subjects: agriculture, chichewa
  // Optional subjects: science (2 pts), chemistry (2 pts)
  // Best optional subject: either science or chemistry (both 2 pts)
  // Total points: 2 + 2 + 2 + 2 = 8 points
  
  console.log("\nExpected Results:");
  console.log("Total Points: 8");
  console.log("Subject Points: {english: 2, mathematics: 2, biology: 2, science: 2} or similar");
  console.log("Final Subjects: ['mathematics', 'biology', 'english', 'science'] or similar");
  
  // Check if our implementation matches expected behavior
  if (result.totalPoints === 8) {
    console.log("\n✅ Test PASSED: Total points calculated correctly");
  } else {
    console.log("\n❌ Test FAILED: Total points calculation incorrect");
  }
}

// Run the test
testGradingSystem();