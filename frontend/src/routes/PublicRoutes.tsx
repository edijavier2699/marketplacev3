import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/mainLayout";
import Marketplace from "@/public/marketplace/marketplace";
import SingleProperty from "@/public/marketplace/singleProperty";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Marketplace />} />
        <Route path="property/:reference_number/" element={<SingleProperty />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;