import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import ScrollToTop from "@/components/ScrollToTop";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useAuth } from "@/hooks/useAuth"; // Importamos el hook

// Importación de rutas de manera perezosa
const AuthRoutes = React.lazy(() => import("../routes/AuthRoutes"));
const ProtectedRoutes = React.lazy(() => import("../routes/ProtectedRoutes"));

const Layout = () => {
  const { isLoading } = useAuth(); // Llamamos al hook aquí

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Toaster />
        <ScrollToTop>
          {isLoading ? (
            <LoadingSpinner /> 
          ) : (
            <Routes>

              <Route path="/auth/*" element={<AuthRoutes />} />

              <Route path="/*" element={<ProtectedRoutes />} />
            </Routes>
          )}
        </ScrollToTop>
      </Suspense>
    </BrowserRouter>
  );
};

export default Layout;
