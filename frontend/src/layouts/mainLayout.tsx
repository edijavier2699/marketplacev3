import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LoadingSpinner } from "@/components/loadingSpinner";

const MainLayout = () => {
  const { isLoading } = useSelector((state: RootState) => state.user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="px-[20px] md:px-[60px]">
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;