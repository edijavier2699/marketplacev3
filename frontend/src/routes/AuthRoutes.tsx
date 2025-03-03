import { Routes, Route } from "react-router-dom";
import SignUpController from "../components/singUpFlow.tsx/singUpController"
import VerifyEmailView from "@/public/login/verifyEmailView";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="sign-up/" element={<SignUpController />} />
      <Route path="verify-email/" element={<VerifyEmailView />} />
    </Routes>
  );
};

export default AuthRoutes;