import React from "react";
import { Navigate } from "react-router-dom";
import mockAuth from "../services/mockAuth";

/*
  ProtectedRoute:
  - This component wraps pages that must be accessed by logged-in users only.
  - If user is not authenticated, we redirect to /login.
  - This mirrors the behavior when you protect backend endpoints with JWT middleware.
*/
export default function ProtectedRoute({ children }) {
  const isAuth = mockAuth.isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
