import React, { useState } from 'react';
import logo from "../../assets/header.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginButton } from "../buttons/loginButton";
import axios, { AxiosError } from "axios";
import { useToast } from '../ui/use-toast';

interface SingUpEmailFormProps {
  onEmailSubmit: (email: string) => void;
}

const SingUpEmailForm = ({ onEmailSubmit }: SingUpEmailFormProps) => {
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [emailError, setEmailError] = useState('');
  const {toast} = useToast()
  

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOnBlur = () =>{    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation pattern
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      setIsDisabled(true); // Disable the button if the email is not valid
    } else {
      setEmailError('');
      setIsDisabled(false); // Enable the button if the email is valid
    }
  }


  const handleContinue = async () => {  
    try {
      // Hacer la petición GET
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}users/check/email/${email}/`);
      if(response.status === 200){
        onEmailSubmit(email)
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          variant: "destructive",
          description: error.response.data.error,
        });
      } else {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg max-w-md p-5 h-auto bg-white shadow-lg flex flex-col">
        <img alt="logo" src={logo} className="h-16 mx-auto mb-5" />
        <h2 className="text-2xl font-bold mb-2 text-center">Create An Account</h2>
        <p className="text-gray-500 mb-[45px] text-sm text-center">
          Invest in Commercial Real Estate. Secure. Simple. Swift.
        </p>

        <label htmlFor="email" className="mb-2">Email</label>
        <Input
          type="email"
          id="email"
          placeholder="Enter a valid email address"
          value={email}
          onBlur={handleOnBlur}
          onChange={handleInputChange}
          className={`mb-2 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
        />
        <div className="min-h-[15px] mb-3">
          {emailError && <span className="text-red-500 text-sm ">{emailError}</span>}
        </div>

        <Button
          onClick={handleContinue}
          disabled={isDisabled}
          className={`w-full ${isDisabled ? 'bg-gray-300' : 'text-black'}`}
        >
          Continue
        </Button>

        <span className="text-xs text-gray-500 mt-3">
          By signing up, you acknowledge that you have read and understood, and agree to Tokunize’s <span className="text-[#C8E870]">Terms</span> and <span className="text-[#C8E870]">Privacy Policy</span>
        </span>
      </div>

      <span className="mt-5">
        Already have an account? <LoginButton />
      </span>
    </div>
  );
};

export default SingUpEmailForm;
