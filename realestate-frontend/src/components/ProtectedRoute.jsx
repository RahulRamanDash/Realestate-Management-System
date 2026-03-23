import { Navigate, Outlet } from "react-router-dom";
import { getLoggedUser, normalizeRole } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const user = getLoggedUser();

  if (!user) {
    return <Navigate to="/userAuth" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizeRole(user.role))) {
    return <Navigate to="/properties" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
