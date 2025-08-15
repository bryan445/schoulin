/**
 * Comprehensive Grading System for Secondary Schools
 * 
 * Form 3 and 4: Points-based system (lower points = better performance)
 * Form 2 and others: Letter grading system
 */

// Points-based grading for Form 3 and 4
export const getPointsFromPercentage = (percentage) => {
  if (percentage >= 80) return 1;
  if (percentage >= 70) return 2;
  if (percentage >= 65) return 3;
  if (percentage >= 60) return 4;
  if (percentage >= 55) return 5;
  if (percentage >= 50) return 6;
  if (percentage >= 45) return 7;
  if (percentage >= 40) return 8;
  return 9; // 0-39%
};

// Letter grading for Form 2 and others
export const getLetterGradeFromPercentage = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "A-";
  if (percentage >= 65) return "B+";
  if (percentage >= 55) return "B";
  if (percentage >= 50) return "B-";
  if (percentage >= 45) return "C+";
  if (percentage >= 40) return "C";
  if (percentage >= 35) return "C-";
  if (percentage >= 30) return "D+";
  if (percentage >= 25) return "D";
  return "F";
};

// Required subjects for Form 3 and 4 final score calculation
export const REQUIRED_SUBJECTS = ['mathematics', 'agriculture', 'biology', 'english', 'chichewa'];

// Calculate final points for Form 3 and 4 students
export const calculateFinalPoints = (subjectMarks) => {
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

  // Calculate final score using 5 required subjects + 1 best optional
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
    bestOptionalSubject,
    breakdown: finalSubjects.map(subject => ({
      subject,
      percentage: subjectMarks[subject],
      points: subjectPoints[subject]
    }))
  };
};

// Get grade color for display
export const getGradeColor = (grade, isPointsSystem = false) => {
  if (isPointsSystem) {
    // Points system: lower is better
    if (grade <= 6) return "#28a745"; // Green for good performance (1-6 points)
    if (grade <= 12) return "#ffc107"; // Yellow for average performance (7-12 points)
    return "#dc3545"; // Red for poor performance (13+ points)
  } else {
    // Letter system
    if (["A+", "A", "A-"].includes(grade)) return "#28a745";
    if (["B+", "B", "B-"].includes(grade)) return "#17a2b8";
    if (["C+", "C", "C-"].includes(grade)) return "#ffc107";
    if (["D+", "D"].includes(grade)) return "#fd7e14";
    return "#dc3545";
  }
};

// Get performance description for points system
export const getPointsPerformanceDescription = (totalPoints) => {
  if (totalPoints <= 6) return "Excellent Performance";
  if (totalPoints <= 12) return "Very Good Performance";
  if (totalPoints <= 18) return "Good Performance";
  if (totalPoints <= 24) return "Average Performance";
  if (totalPoints <= 30) return "Below Average Performance";
  return "Needs Improvement";
};

// Check if student is in Form 3 or 4 (uses points system)
// For grade-based schools, always use letter grades
export const isPointsSystemStudent = (studentClass, isGradeBasedSchool = false) => {
  // If it's a grade-based school, never use points system
  if (isGradeBasedSchool) {
    return false;
  }
  return studentClass === "Form 3" || studentClass === "Form 4";
};

// Main grading function that determines which system to use
export const getStudentGrade = (percentage, studentClass, isGradeBasedSchool = false) => {
  if (isPointsSystemStudent(studentClass, isGradeBasedSchool)) {
    return {
      type: 'points',
      value: getPointsFromPercentage(percentage),
      display: `${getPointsFromPercentage(percentage)} pts`
    };
  } else {
    const letterGrade = getLetterGradeFromPercentage(percentage);
    return {
      type: 'letter',
      value: letterGrade,
      display: letterGrade
    };
  }
};

// Format subject name for display
export const formatSubjectName = (subject) => {
  const subjectNames = {
    'mathematics': 'Mathematics',
    'agriculture': 'Agriculture',
    'biology': 'Biology',
    'english': 'English',
    'chichewa': 'Chichewa',
    'science': 'Science',
    'history': 'History',
    'geography': 'Geography',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'socialstudies': 'Social Studies',
    'religiousstudies': 'Religious Studies'
  };
  
  return subjectNames[subject.toLowerCase()] || subject.charAt(0).toUpperCase() + subject.slice(1);
};
