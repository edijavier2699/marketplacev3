import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboardLayout";
import ProtectedRoute from "@/layouts/protectedRoutes";
import Dashboard from "@/layouts/dashboard";
import Assets from "@/private/investor/assets/assets";
import WalletView from "@/private/investor/wallet/walletView";
import Transactions from "@/private/investor/transactions/transactions";
import PropertyManagement from "@/private/admin/propertyManagment";
import SearchProperty from "@/private/investor/search/searchProperty";
import ProcessCheck from "@/private/investor/process/processCheck";

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route
          path="/"
          element={<ProtectedRoute roleRequired="user,admin" element={<Dashboard />} />}
        />
        <Route
          path="investments/"
          element={<ProtectedRoute roleRequired="user" element={<Assets />} />}
        />
        <Route
          path="wallet-view/"
          element={<ProtectedRoute roleRequired="user" element={<WalletView />} />}
        />
        <Route
          path="transactions/"
          element={<ProtectedRoute roleRequired="user" element={<Transactions />} />}
        />
        <Route
          path="search-property/"
          element={<ProtectedRoute roleRequired="user" element={<SearchProperty />} />}
        />
        <Route
              path="check-process/"
              element={<ProtectedRoute roleRequired="user" element={<ProcessCheck />} />}
            />
    
        <Route
          path="property-managment/"
          element={<ProtectedRoute roleRequired="admin" element={<PropertyManagement />} />}
        />
      </Route>
    </Routes>
  );
};

export default ProtectedRoutes;