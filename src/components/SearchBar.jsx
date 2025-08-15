import React from "react";

function SearchBar({ value, onChange }) {
  const styles = {
    container: {
      position: "relative",
      maxWidth: "500px",
      width: "100%"
    },
    input: {
      width: "100%",
      padding: "15px 50px 15px 20px",
      fontSize: "16px",
      border: "none",
      borderRadius: "25px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      outline: "none",
      transition: "all 0.3s ease",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    searchIcon: {
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "18px",
      color: "#666",
      pointerEvents: "none"
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search schools by name or location..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
        onFocus={(e) => {
          e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
          e.target.style.transform = "translateY(-2px)";
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
          e.target.style.transform = "translateY(0)";
        }}
      />
      <div style={styles.searchIcon}>🔍</div>
    </div>
  );
}

export default SearchBar;
