import { AlignJustify } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { LoginButton } from "./buttons/loginButton";
import LogoutButton from "./buttons/logoutBtn";
import { Link } from "react-router-dom";
import Logo from "../assets/img/logo.jpg";
import { UserNavbar } from "./dashboard/useNavbar";
import { useAuth } from "@/hooks/useAuth"; // Importamos useAuth

export const Navbar = () => {
  const { isAuthenticated } = useAuth(); // 🔹 Solo necesitamos isAuthenticated

  return (
    <nav className="flex justify-between items-center py-4">
      <div>
        <img src={Logo} className="h-12" alt="Logo" />
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <a href="https://www.tokunize.com/blog/" target="_blank" rel="noopener noreferrer">Learn</a>

        {isAuthenticated ? (
          <UserNavbar />
        ) : (
          <>
            <Link to="/auth/sign-up/">Sign Up</Link>
            <LoginButton />
          </>
        )}
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <AlignJustify className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Tokunize</SheetTitle>
              <SheetDescription className="hidden">Navigate through the app</SheetDescription> 
            </SheetHeader>

            <div className="flex flex-col space-y-4 mt-4">
              <Link to="/">Home</Link>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/">Dashboard</Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link to="/sign-up">Sign Up</Link>
                  <LoginButton />
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
