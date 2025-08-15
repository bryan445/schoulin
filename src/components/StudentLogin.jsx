import React, { useState } from "react";

function StudentLogin({ onLogin, title = "Student Login", type = "account", schoolId }) {
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Helper function to normalize class names (convert Grade/Gradde/Form to a standard format)
  const normalizeClass = (className) => {
    if (!className) return "";
    
    // Convert to lowercase and remove extra spaces
    const cleanName = className.toLowerCase().trim();
    
    // Extract the number from the class name (grade, gradde, or form)
    const numberMatch = cleanName.match(/(grade|gradde|form)\s*(\d+)/);
    if (numberMatch) {
      return `grade ${numberMatch[2]}`; // Always use "grade" format internally
    }
    
    return cleanName;
  };

  // Helper function to check if class names match (allowing Grade/Gradde/Form interchange)
  const doClassesMatch = (inputClass, studentClass, classKey) => {
    const normalizedInput = normalizeClass(inputClass);
    const normalizedStudentClass = normalizeClass(studentClass);
    const normalizedClassKey = normalizeClass(classKey);
    
    // Check if input matches either the student's class field or the class key
    return normalizedInput === normalizedStudentClass || normalizedInput === normalizedClassKey;
  };

  const loadStudentData = async (name, className) => {
    try {
      // Add cache-busting parameter to force fresh data
      const cacheBuster = new Date().getTime();
      const response = await fetch(`/schools/students-${schoolId}.json?t=${cacheBuster}`);
      if (!response.ok) {
        throw new Error('Failed to load student data');
      }
      const data = await response.json();
      
      // Determine if this is a grade-based school by checking if keys start with "Grade"
      const isGradeBasedSchool = Object.keys(data).some(key =>
        key.toLowerCase().startsWith('grade')
      );
      
      // Search through all classes for the student
      for (const [classKey, students] of Object.entries(data)) {
        const student = students.find(s =>
          s.name.toLowerCase() === name.toLowerCase() &&
          doClassesMatch(className, s.class, classKey)
        );
        if (student) {
          // Add school type information to student object
          return {
            ...student,
            isGradeBasedSchool
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading student data:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentClass.trim()) {
      setError("Please enter your name and class");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const student = await loadStudentData(studentName.trim(), studentClass.trim());
      
      if (student) {
        onLogin(student);
      } else {
        setError("Student not found. Please check your name and class.");
      }
    } catch (error) {
      setError("Error loading student data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    },
    modal: {
      backgroundColor: "white",
      borderRadius: "15px",
      padding: "30px",
      minWidth: "400px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      animation: "slideIn 0.3s ease"
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
      color: "#333"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    input: {
      padding: "12px 15px",
      fontSize: "16px",
      border: "2px solid #e1e1e1",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.3s ease"
    },
    button: {
      padding: "12px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "white",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "transform 0.2s ease",
      marginTop: "10px"
    },
    cancelButton: {
      padding: "8px 15px",
      fontSize: "14px",
      color: "#666",
      background: "transparent",
      border: "1px solid #ddd",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "10px"
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      justifyContent: "space-between"
    },
    error: {
      color: "#dc3545",
      fontSize: "14px",
      marginBottom: "10px",
      textAlign: "center",
      padding: "8px",
      backgroundColor: "#fff5f5",
      borderRadius: "4px",
      border: "1px solid #dc3545"
    },
    helpText: {
      fontSize: "12px",
      color: "#666",
      textAlign: "center",
      marginBottom: "15px"
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.helpText}>
          Enter your full name and class to access your account
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter your full name (e.g., John Mwamba)"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e1e1e1"}
            autoFocus
          />
          
          <input
            type="text"
            placeholder="Enter your class (e.g., Form 4, Grade 4, Gradde 4)"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e1e1e1"}
          />
          
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => onLogin(null)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.button}
              disabled={isSubmitting}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              {isSubmitting ? "Loading..." : `View ${type === "results" ? "Results" : "Account"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
