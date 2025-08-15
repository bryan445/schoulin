import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StudentLogin from "./components/StudentLogin";
import StudentDetails from "./components/StudentDetails";
import ContactPanel from "./components/ContactPanel";
import FeeModal from "./components/FeeModal";

function SchoolPage() {
  const { schoolId } = useParams();
  const [schoolData, setSchoolData] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [loginType, setLoginType] = useState("account");
  const [currentStudent, setCurrentStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Add cache-busting parameter to force fresh data
    const cacheBuster = new Date().getTime();
    fetch(`./schools/${schoolId}.json?t=${cacheBuster}`)
      .then((res) => res.json())
      .then((data) => setSchoolData(data))
      .catch((err) => console.error("Error loading school data:", err));
  }, [schoolId]);

  const handleStudentLogin = (studentData) => {
    if (studentData) {
      setCurrentStudent(studentData);
      setShowLogin(false);
    } else {
      setShowLogin(false);
      setCurrentStudent(null);
    }
  };

  const handleLoginRequest = (type) => {
    setLoginType(type);
    setShowLogin(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!schoolData) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        fontSize: "1.5rem"
      }}>
        Loading school information...
      </div>
    );
  }

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      padding: "clamp(20px, 4vw, 30px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    },
    schoolHeader: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "10px"
    },
    schoolLogo: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
    },
    schoolInfo: {
      flex: 1
    },
    schoolName: {
      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
      fontWeight: "bold",
      color: "#333",
      margin: "0 0 5px 0"
    },
    motto: {
      fontSize: "1.1rem",
      fontStyle: "italic",
      color: "#667eea",
      marginBottom: "15px",
      fontWeight: "500"
    },
    compactButtons: {
      display: "flex",
      gap: "10px",
      marginTop: "5px"
    },
    compactButton: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      cursor: "pointer",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease"
    },
    location: {
      fontSize: "1.2rem",
      color: "#666",
      display: "flex",
      alignItems: "center",
      marginBottom: "20px"
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 15px",
      backgroundColor: "#667eea",
      color: "white",
      textDecoration: "none",
      borderRadius: "20px",
      fontSize: "14px",
      transition: "all 0.3s ease"
    },
    tabs: {
      display: "flex",
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "0 30px",
      borderBottom: "1px solid rgba(0,0,0,0.1)"
    },
    tab: {
      padding: "15px 25px",
      cursor: "pointer",
      borderBottom: "3px solid transparent",
      fontSize: "16px",
      fontWeight: "500",
      color: "#666",
      transition: "all 0.3s ease"
    },
    activeTab: {
      color: "#667eea",
      borderBottomColor: "#667eea"
    },
    content: {
      padding: "40px 30px"
    },
    actionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "40px"
    },
    actionButton: {
      padding: "20px",
      backgroundColor: "white",
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textAlign: "center"
    },
    buttonIcon: {
      fontSize: "2rem",
      marginBottom: "10px",
      display: "block"
    },
    buttonTitle: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "5px"
    },
    buttonDesc: {
      fontSize: "0.9rem",
      color: "#666"
    },
    section: {
      backgroundColor: "white",
      borderRadius: "15px",
      padding: "25px",
      marginBottom: "25px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    newsGrid: {
      display: "grid",
      gap: "15px"
    },
    newsItem: {
      padding: "15px",
      border: "1px solid #e1e1e1",
      borderRadius: "8px",
      transition: "all 0.3s ease"
    },
    newsTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "5px"
    },
    newsDate: {
      fontSize: "0.8rem",
      color: "#666",
      marginBottom: "8px"
    },
    newsContent: {
      fontSize: "0.9rem",
      color: "#555",
      lineHeight: "1.4"
    },
    urgent: {
      borderLeft: "4px solid #dc3545",
      backgroundColor: "#fff5f5"
    },
    aboutText: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "#555",
      marginBottom: "20px"
    },
    admissionSection: {
      display: "grid",
      gap: "15px"
    },
    admissionItem: {
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px"
    },
    admissionLabel: {
      fontWeight: "600",
      color: "#333",
      marginBottom: "5px"
    }
  };

  const renderOverview = () => (
    <div>

      {/* Announcements */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          📢 Latest Announcements
        </h3>
        <div style={styles.newsGrid}>
          {schoolData.announcements.map((announcement, index) => (
            <div
              key={index}
              style={{
                ...styles.newsItem,
                ...(announcement.urgent ? styles.urgent : {})
              }}
            >
              <div style={styles.newsTitle}>
                {announcement.urgent && "🚨 "}{announcement.title}
              </div>
              <div style={styles.newsDate}>{formatDate(announcement.date)}</div>
              <div style={styles.newsContent}>{announcement.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* News */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          📰 School News
        </h3>
        <div style={styles.newsGrid}>
          {schoolData.news.map((newsItem, index) => (
            <div key={index} style={styles.newsItem}>
              <div style={styles.newsTitle}>{newsItem.title}</div>
              <div style={styles.newsDate}>{formatDate(newsItem.date)}</div>
              <div style={styles.newsContent}>{newsItem.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>📖 About {schoolData.name}</h3>
      <p style={styles.aboutText}>{schoolData.about}</p>
    </div>
  );

  const renderAdmission = () => (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>🎓 Admission Information</h3>
      <div style={styles.admissionSection}>
        <div style={styles.admissionItem}>
          <div style={styles.admissionLabel}>Requirements:</div>
          <div>{schoolData.admissionInfo.requirements}</div>
        </div>
        <div style={styles.admissionItem}>
          <div style={styles.admissionLabel}>Application Process:</div>
          <div>{schoolData.admissionInfo.process}</div>
        </div>
        <div style={styles.admissionItem}>
          <div style={styles.admissionLabel}>Application Deadline:</div>
          <div>{schoolData.admissionInfo.deadline}</div>
        </div>
        <div style={styles.admissionItem}>
          <div style={styles.admissionLabel}>Contact Information:</div>
          <div>{schoolData.admissionInfo.contact}</div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return renderAbout();
      case "admission":
        return renderAdmission();
      default:
        return renderOverview();
    }
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.schoolHeader}>
            <img 
              src={`/logos/${schoolId}.png`} 
              alt={`${schoolData.name} Logo`}
              style={styles.schoolLogo}
            />
            <div style={styles.schoolInfo}>
              <h1 style={styles.schoolName}>{schoolData.name}</h1>
              <div style={styles.motto}>
                "{schoolData.motto}"
              </div>
              <div style={styles.compactButtons}>
                <button 
                  style={styles.compactButton}
                  onClick={() => setShowFeeModal(true)}
                  title="School Fees"
                >
                  💰
                </button>
                <button 
                  style={styles.compactButton}
                  onClick={() => handleLoginRequest("account")}
                  title="Account Details"
                >
                  👤
                </button>
                <button 
                  style={styles.compactButton}
                  onClick={() => handleLoginRequest("results")}
                  title="Exam Results"
                >
                  📊
                </button>
                <button 
                  style={styles.compactButton}
                  onClick={() => setActiveTab("admission")}
                  title="Admission"
                >
                  🎓
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "overview" ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "about" ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab("about")}
          >
            About
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "admission" ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab("admission")}
          >
            Admission
          </div>
        </div>

        <div style={styles.content}>
          {renderTabContent()}
        </div>

        {showLogin && (
          <StudentLogin
            onLogin={handleStudentLogin}
            title={loginType === "results" ? "Student Results Access" : "Student Account Access"}
            type={loginType}
            schoolId={schoolId}
          />
        )}

        {currentStudent && (
          <StudentDetails
            student={currentStudent}
            type={loginType}
            onClose={() => setCurrentStudent(null)}
          />
        )}

        {showFeeModal && (
          <FeeModal
            school={schoolData}
            onClose={() => setShowFeeModal(false)}
          />
        )}
      </div>
      <ContactPanel />
    </div>
  );
}

export default SchoolPage;