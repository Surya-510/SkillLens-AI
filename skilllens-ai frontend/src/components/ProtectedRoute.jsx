import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const current = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (role && current !== role) {

    if (current === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}