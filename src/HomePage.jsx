import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import FlashCards from "./components/FlashCards";
import ContactPanel from "./components/ContactPanel";

const schools = [
  { id: "chisomo", name: "Chisomo Academy", location: "Zalewa" },
  { id: "ngoms", name: "Ngoms", location: "Zalewa" },
  { id: "mepic", name: "Mepic Schools", location: "Balaka" },
  { id: "milpark", name: "Milpark Private Secondary", location: "Mwanza" },
  { id: "ekhaya", name: "Ekhaya Academy", location: "Zalewa" },
  { id: "soba", name: "Soba", location: "Mzuzu" },
  {id: "wibra", name: "Wibra Foundation", location: "Zalewa" },
  {id: "covenant", name: "Covenant Academy", location: "Mwanza" },
];

function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(query.toLowerCase()) ||
    school.location.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (schoolId) => {
    navigate(`/school/${schoolId}`);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      "@media (max-width: 768px)": {
        padding: "20px 10px"
      }
    },
    header: {
      textAlign: "center",
      marginBottom: "40px"
    },
    title: {
      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
      fontWeight: "bold",
      color: "white",
      textShadow: "0 4px 8px rgba(0,0,0,0.3)",
      marginBottom: "10px"
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "rgba(255,255,255,0.9)",
      marginBottom: "0"
    },
    searchContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "40px"
    },
    schoolsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    schoolCard: {
      background: "white",
      borderRadius: "15px",
      padding: "25px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none"
    },
    schoolName: {
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "8px"
    },
    schoolLocation: {
      fontSize: "1rem",
      color: "#666",
      display: "flex",
      alignItems: "center"
    },
    noResults: {
      textAlign: "center",
      color: "white",
      fontSize: "1.2rem",
      marginTop: "40px"
    }
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Schoolin</h1>
          <p style={styles.subtitle}>Your Gateway to School Information</p>
        </div>
        
        <div style={styles.searchContainer}>
          <SearchBar value={query} onChange={setQuery} />
        </div>
        
        {!query.trim() && <FlashCards />}
        
        {query.trim() && (
          <div style={styles.schoolsGrid}>
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <div
                  key={school.id}
                  style={styles.schoolCard}
                  onClick={() => handleSelect(school.id)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-5px)";
                    e.target.style.boxShadow = "0 12px 35px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={styles.schoolName}>{school.name}</div>
                  <div style={styles.schoolLocation}>
                    📍 {school.location}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noResults}>
                No schools found matching "{query}"
              </div>
            )}
          </div>
        )}
      </div>
      <ContactPanel />
    </div>
  );
}

export default HomePage;
