import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LoadingSpinner } from "@/components/loadingSpinner";

interface ProtectedRouteProps {
  element: React.ReactElement;
  roleRequired: string; // Roles permitidos separados por comas
}

const ProtectedRoute = ({ element, roleRequired }: ProtectedRouteProps) => {
  const location = useLocation();
  const { role, isLoading, isAuthenticated } = useSelector((state: RootState) => state.user);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const allowedRoles = roleRequired.split(",").map((r) => r.trim());

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;
