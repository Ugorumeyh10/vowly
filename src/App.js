import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HomePage from "./HomePage";
import Dashboard from "./Dashboard";
import Callback from "./Callback";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<HomePage />} />
      <Route path="/callback" element={<Callback />} />
      {/* The Dashboard is now the main entry point, accessible to everyone */}
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
