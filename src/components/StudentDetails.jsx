import React, { useState } from "react";
import {
  getStudentGrade,
  calculateFinalPoints,
  getGradeColor,
  getPointsPerformanceDescription,
  isPointsSystemStudent,
  getPointsFromPercentage,
  formatSubjectName
} from "../utils/gradingSystem";

function StudentDetails({ student, type, onClose }) {
  const [activeSection, setActiveSection] = useState("term");
  const [selectedTerm, setSelectedTerm] = useState(() => {
    // Set default to first available term
    const availableTerms = Object.keys(student.results || {});
    return availableTerms.length > 0 ? availableTerms[0] : "term1";
  });
  const [selectedAssessment, setSelectedAssessment] = useState("firstAssessment");
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGradeFromMark = (mark) => {
    const gradeInfo = getStudentGrade(mark, student.class, student.isGradeBasedSchool);
    return gradeInfo.display;
  };

  const getSubjectNames = () => {
    if (student.results && Object.keys(student.results).length > 0) {
      const firstTerm = Object.values(student.results)[0];
      if (firstTerm.firstAssessment) {
        // Get all subjects from all assessments in all terms
        const allSubjects = new Set();
        Object.values(student.results).forEach(term => {
          if (term.firstAssessment) {
            Object.keys(term.firstAssessment).forEach(subject => {
              if (!['date', 'average'].includes(subject)) {
                allSubjects.add(subject);
              }
            });
          }
          if (term.secondAssessment) {
            Object.keys(term.secondAssessment).forEach(subject => {
              if (!['date', 'average'].includes(subject)) {
                allSubjects.add(subject);
              }
            });
          }
          if (term.finalExam) {
            Object.keys(term.finalExam).forEach(subject => {
              if (!['date', 'average', 'totalPoints'].includes(subject)) {
                allSubjects.add(subject);
              }
            });
          }
        });
        return Array.from(allSubjects);
      }
    }
    return ['english', 'mathematics', 'science', 'history', 'geography'];
  };

  const subjects = getSubjectNames();
  
  // Use actual student data
  const data = {
    results: student.results || {},
    personalInfo: {
      studentId: student.id,
      dateOfBirth: student.dateOfBirth,
      guardianName: student.guardian,
      guardianPhone: student.phone,
      address: student.address,
      enrollmentDate: student.admissionDate,
      status: "Active"
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
      maxWidth: "600px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
    },
    header: {
      borderBottom: "2px solid #f0f0f0",
      paddingBottom: "20px",
      marginBottom: "25px"
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "10px"
    },
    studentInfo: {
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px"
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontSize: "14px"
    },
    label: {
      fontWeight: "600",
      color: "#666"
    },
    value: {
      color: "#333"
    },
    resultsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    },
    tableHeader: {
      backgroundColor: "#667eea",
      color: "white",
      padding: "12px",
      textAlign: "left"
    },
    tableCell: {
      padding: "10px 12px",
      borderBottom: "1px solid #eee"
    },
    grade: {
      fontWeight: "bold",
      padding: "4px 8px",
      borderRadius: "4px",
      color: "white"
    },
    summary: {
      backgroundColor: "#e8f5e8",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px"
    },
    closeButton: {
      padding: "10px 20px",
      backgroundColor: "#667eea",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      float: "right"
    },
    tabs: {
      display: "flex",
      borderBottom: "2px solid #f0f0f0",
      marginBottom: "20px"
    },
    tab: {
      padding: "12px 20px",
      cursor: "pointer",
      borderBottom: "3px solid transparent",
      fontSize: "14px",
      fontWeight: "500",
      color: "#666",
      transition: "all 0.3s ease",
      marginRight: "10px"
    },
    activeTab: {
      color: "#667eea",
      borderBottomColor: "#667eea",
      fontWeight: "600"
    },
    scrollSection: {
      maxHeight: "300px",
      overflowY: "auto",
      padding: "10px",
      border: "1px solid #e1e1e1",
      borderRadius: "8px",
      marginBottom: "15px"
    },
    termCard: {
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "15px",
      border: "1px solid #e1e1e1"
    },
    termHeader: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "10px"
    },
    compactTable: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px"
    },
    compactCell: {
      padding: "6px 8px",
      borderBottom: "1px solid #eee"
    },
    finalResultCard: {
      backgroundColor: "#e8f5e8",
      padding: "20px",
      borderRadius: "10px",
      border: "2px solid #28a745"
    },
    promotionBadge: {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      color: "white",
      marginTop: "10px"
    }
  };

  const getGradeColorLocal = (grade) => {
    const isPoints = isPointsSystemStudent(student.class, student.isGradeBasedSchool);
    if (isPoints) {
      // For points system, grade will be like "3 pts"
      const points = parseInt(grade.split(' ')[0]);
      return getGradeColor(points, true);
    } else {
      // For letter grades
      return getGradeColor(grade, false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {type === "results" ? "Academic Results" : "Account Details"}
          </h2>
          <div style={styles.studentInfo}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Student Name:</span>
              <span style={styles.value}>{student.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Class:</span>
              <span style={styles.value}>
                {student.isGradeBasedSchool
                  ? student.class.replace("Form", "Grade")
                  : student.class}
              </span>
            </div>
          </div>
        </div>

        {type === "results" ? (
          <div>
            {/* Term Selection */}
            <div style={styles.tabs}>
              {Object.keys(data.results).map((termKey) => (
                <div
                  key={termKey}
                  style={{
                    ...styles.tab,
                    ...(selectedTerm === termKey ? styles.activeTab : {})
                  }}
                  onClick={() => setSelectedTerm(termKey)}
                >
                  📊 {termKey.replace('term', 'Term ')}
                </div>
              ))}
            </div>

            {/* Assessment Type Selection */}
            {data.results[selectedTerm] && data.results[selectedTerm].firstAssessment && (
              <div>
                <div style={{
                  ...styles.tabs,
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: "10px",
                  marginTop: "10px"
                }}>
                  <div
                    style={{
                      ...styles.tab,
                      ...(selectedAssessment === "firstAssessment" ? styles.activeTab : {})
                    }}
                    onClick={() => setSelectedAssessment("firstAssessment")}
                  >
                    📝 First Assessment
                  </div>
                  <div
                    style={{
                      ...styles.tab,
                      ...(selectedAssessment === "secondAssessment" ? styles.activeTab : {})
                    }}
                    onClick={() => setSelectedAssessment("secondAssessment")}
                  >
                    📄 Second Assessment
                  </div>
                  <div
                    style={{
                      ...styles.tab,
                      ...(selectedAssessment === "finalExam" ? styles.activeTab : {})
                    }}
                    onClick={() => setSelectedAssessment("finalExam")}
                  >
                    🎯 Final Exam
                  </div>
                  <div
                    style={{
                      ...styles.tab,
                      ...(selectedAssessment === "termSummary" ? styles.activeTab : {})
                    }}
                    onClick={() => setSelectedAssessment("termSummary")}
                  >
                    📈 Term Summary
                  </div>
                </div>

                {/* Display Selected Assessment Results */}
                {selectedAssessment !== "termSummary" ? (
                  <div>
                    <div style={styles.summary}>
                      <h3>{selectedAssessment.replace('Assessment', ' Assessment').replace('finalExam', 'Final Exam')} - {selectedTerm.replace('term', 'Term ')}</h3>
                      
                      {data.results[selectedTerm][selectedAssessment] && (
                        <>
                          <div style={styles.infoRow}>
                            <span style={styles.label}>Assessment Date:</span>
                            <span style={styles.value}>
                              {data.results[selectedTerm][selectedAssessment].date ? 
                                formatDate(data.results[selectedTerm][selectedAssessment].date) : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.infoRow}>
                            <span style={styles.label}>Average Score:</span>
                            <span style={styles.value}>{data.results[selectedTerm][selectedAssessment].average}%</span>
                          </div>
                          {selectedAssessment === "finalExam" && data.results[selectedTerm].finalExam?.totalPoints && (
                            <div style={styles.infoRow}>
                              <span style={styles.label}>Total Points:</span>
                              <span style={styles.value}>{data.results[selectedTerm].finalExam.totalPoints} pts</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <table style={styles.resultsTable}>
                      <thead>
                        <tr>
                          <th style={styles.tableHeader}>Subject</th>
                          <th style={styles.tableHeader}>Marks</th>
                          <th style={styles.tableHeader}>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects
                          .filter(subject => data.results[selectedTerm][selectedAssessment]?.[subject] !== undefined)
                          .map((subject) => {
                            const mark = data.results[selectedTerm][selectedAssessment]?.[subject] || 0;
                            const grade = getGradeFromMark(mark);
                            return (
                              <tr key={subject}>
                                <td style={styles.tableCell}>
                                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                </td>
                                <td style={styles.tableCell}>{mark}/100</td>
                                <td style={styles.tableCell}>
                                  <span
                                    style={{
                                      ...styles.grade,
                                      backgroundColor: getGradeColorLocal(grade)
                                    }}
                                  >
                                    {grade}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Term Summary View
                  <div>
                    <div style={styles.summary}>
                      <h3>Term Summary - {selectedTerm.replace('term', 'Term ')}</h3>
                      <div style={styles.infoRow}>
                        <span style={styles.label}>Term Average:</span>
                        <span style={styles.value}>{data.results[selectedTerm].termAverage}%</span>
                      </div>
                      <div style={styles.infoRow}>
                        <span style={styles.label}>Term Grade:</span>
                        <span style={styles.value}>
                          {isPointsSystemStudent(student.class, student.isGradeBasedSchool)
                            ? data.results[selectedTerm].finalExam?.totalPoints
                              ? `${data.results[selectedTerm].finalExam.totalPoints} pts`
                              : `${getPointsFromPercentage(data.results[selectedTerm].termAverage)} pts`
                            : data.results[selectedTerm].termGrade}
                        </span>
                      </div>
                      <div style={styles.infoRow}>
                        <span style={styles.label}>Class Position:</span>
                        <span style={styles.value}>
                          {data.results[selectedTerm].position} out of {data.results[selectedTerm].totalStudents}
                        </span>
                      </div>
                    </div>

                    {/* Assessment Comparison Table */}
                    <table style={styles.resultsTable}>
                      <thead>
                        <tr>
                          <th style={styles.tableHeader}>Subject</th>
                          <th style={styles.tableHeader}>1st Assessment</th>
                          <th style={styles.tableHeader}>2nd Assessment</th>
                          <th style={styles.tableHeader}>Final Exam</th>
                          <th style={styles.tableHeader}>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects
                          .filter(subject =>
                            data.results[selectedTerm].firstAssessment?.[subject] !== undefined ||
                            data.results[selectedTerm].secondAssessment?.[subject] !== undefined ||
                            data.results[selectedTerm].finalExam?.[subject] !== undefined
                          )
                          .map((subject) => {
                            const first = data.results[selectedTerm].firstAssessment?.[subject] || 0;
                            const second = data.results[selectedTerm].secondAssessment?.[subject] || 0;
                            const final = data.results[selectedTerm].finalExam?.[subject] || 0;
                            const progress = final - first;
                            return (
                              <tr key={subject}>
                                <td style={styles.tableCell}>
                                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                </td>
                                <td style={styles.tableCell}>{first}</td>
                                <td style={styles.tableCell}>{second}</td>
                                <td style={styles.tableCell}>{final}</td>
                                <td style={styles.tableCell}>
                                  <span style={{
                                    color: progress >= 0 ? "#28a745" : "#dc3545",
                                    fontWeight: "bold"
                                  }}>
                                    {progress >= 0 ? '+' : ''}{progress}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* If no assessment data available */}
            {(!data.results[selectedTerm] || !data.results[selectedTerm].firstAssessment) && (
              <div style={styles.summary}>
                <h3>No Results Available</h3>
                <p>Assessment results for this term are not yet available.</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Financial Information Only */}
            <div style={{ ...styles.summary, backgroundColor: "#e8f5e8" }}>
              <h3 style={{ marginBottom: "15px", color: "#333" }}>💰 Financial Information</h3>
              
              <div style={styles.infoRow}>
                <span style={styles.label}>Total Fees Owed:</span>
                <span style={styles.value}>MK {student.fees?.totalOwed?.toLocaleString() || 'N/A'}</span>
              </div>
              
              <div style={styles.infoRow}>
                <span style={styles.label}>Total Fees Paid:</span>
                <span style={{
                  ...styles.value,
                  color: "#28a745",
                  fontWeight: "bold"
                }}>
                  MK {student.fees?.totalPaid?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <div style={styles.infoRow}>
                <span style={styles.label}>Outstanding Balance:</span>
                <span style={{
                  ...styles.value,
                  color: student.fees?.balance > 0 ? "#dc3545" : "#28a745",
                  fontWeight: "bold",
                  fontSize: "1.1rem"
                }}>
                  MK {student.fees?.balance?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              {student.fees?.nextPaymentDue && (
                <div style={styles.infoRow}>
                  <span style={styles.label}>Next Payment Due:</span>
                  <span style={{
                    ...styles.value,
                    color: "#667eea",
                    fontWeight: "600"
                  }}>
                    {new Date(student.fees.nextPaymentDue).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              <div style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: student.fees?.balance === 0 ? "#d4edda" : "#fff3cd",
                borderRadius: "8px",
                border: `2px solid ${student.fees?.balance === 0 ? "#28a745" : "#ffc107"}`
              }}>
                <div style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: student.fees?.balance === 0 ? "#155724" : "#856404",
                  textAlign: "center"
                }}>
                  {student.fees?.balance === 0 ? "✅ FEES FULLY PAID" : "⚠️ OUTSTANDING BALANCE"}
                </div>
                {student.fees?.balance > 0 && (
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#856404",
                    textAlign: "center",
                    marginTop: "8px"
                  }}>
                    Please settle the outstanding balance by the due date.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6fd8"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#667eea"}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default StudentDetails;
