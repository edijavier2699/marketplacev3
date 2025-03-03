import { Outlet } from "react-router-dom";
// Importa la acción para guardar el rol en Redux
import SideMenu from "@/components/dashboard/sideMenu";
import { UserNavbar } from "@/components/dashboard/useNavbar";
import { WalletMinimal, Coins, Grid2x2,SearchCheck ,Clock3, User} from "lucide-react";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { GrTransaction } from "react-icons/gr";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DashboardLayout = () => {
  const { role, isLoading } = useSelector((state: RootState) => state.user);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const menuData =
    role === "admin"
      ? [
          { name: "Overview", link: "/app/dashboard/", icon: <Grid2x2 /> },
          { name: "Property Management", link: "/app/property-managment/", icon: <Grid2x2 /> },
        ]
      : role === "user"
      ? [
          { name: "Overview", link: "/app/dashboard/", icon: <Grid2x2 /> },
          { name: "Assets", link: "/app/investments/", icon: <Coins /> },
          { name: "Search", link: "/app/search-property/", icon: <SearchCheck /> },
          { name: "Wallet", link: "/app/wallet-view/", icon: <WalletMinimal /> },
          { name: "Transactions", link: "/app/transactions/", icon: <GrTransaction /> },
          { name: "Proccess", link: "/app/check-process/", icon: <Clock3 /> },
          { name: "Profile", link: "/app/transactions/", icon: <User /> },

        ]
      : [];

  return (
    <div className="flex min-h-screen">
      <SideMenu data={menuData} onMenuClick={() => {}} />
      <div className="w-full px-[20px] py-4 mt-[64px] lg:mt-[0px]">
        <div className="flex items-center justify-end mb-5">
          <UserNavbar />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;