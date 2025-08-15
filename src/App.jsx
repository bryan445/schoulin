import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SchoolPage from "./SchoolPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/school/:schoolId" element={<SchoolPage />} />
    </Routes>
  );
}

export default App;
