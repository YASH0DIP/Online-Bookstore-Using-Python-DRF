import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { JSX } from "react";

const ProtectRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectRoute;
