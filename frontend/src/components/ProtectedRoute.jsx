import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if token exists in storage
  const token = localStorage.getItem("token");

  // If NO token, redirect to login and REPLACE the current history entry
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token EXISTS, render the requested page (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;