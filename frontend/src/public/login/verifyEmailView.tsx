import { FaEnvelope } from "react-icons/fa";
import backgroundImage from "../../assets/signImage.png";
import logo from "../../assets/header.png";
import ResendEmailVerificationForm from "@/components/forms/resendEmailVerification";

const VerifyEmailView = () => {

  return (
    <section
      className="relative min-h-screen bg-gray-100 bg-cover bg-center px-4 py-8 flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Logo en la esquina superior derecha */}
      <img
        alt="logo"
        src={logo}
        className="absolute top-4 left-4 h-14"
      />

      {/* Contenedor principal */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <FaEnvelope className="text-[#C8E870] text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-600">
          We’ve sent a confirmation email to your inbox. Please check your email and click the verification link to proceed.
        </p>
        <div className="mt-6 text-left">
            <ResendEmailVerificationForm/>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mt-2">
            Didn’t receive an email? Make sure to check your spam folder.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailView;
