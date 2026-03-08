import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  const adminRoles = [
    "Admin",
    "Dean",
    "CEO",
    "Manager",
    "Director",
    "Boss",
    "HOD"
  ];

  if (role === "admin" && !adminRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  if (role === "employee" && user.role !== "Employee") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;