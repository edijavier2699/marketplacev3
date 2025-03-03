import React from 'react';
import { FaArrowCircleLeft } from "react-icons/fa"; // Importar los iconos del ojo
import "../../styles/singUp.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from '../ui/use-toast';
import logo from "../../assets/header.png";
import { Button } from "@/components/ui/button";
import InputForm from './inputForm';
import { signUpFormSchema, SingUpFormValues } from './schemas/signUpFormSchema';

interface Props {
  email: string;
  setIsEmailSubmitted: React.Dispatch<React.SetStateAction<number>>;
  onSignUpSuccess: (data: any) => void;
}

export function SignUpForm({ email, setIsEmailSubmitted, onSignUpSuccess }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<SingUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email,
    },
  });

  async function onSubmit(data: SingUpFormValues) {
    onSignUpSuccess(data);
    toast({
      title: "Thank you",
      description: "We are one step closer to setting up your account.",
      duration: 2000,
      variant: "default",
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg p-5 h-auto bg-white space-y-6 shadow-lg">
      <button
        type="button"
        className="flex items-center text-xl text-blue-500 hover:underline"
        onClick={() => {
          setIsEmailSubmitted(1);
          reset();
        }}
      >
        <FaArrowCircleLeft className="mr-2 text-[#C8E870]" />
      </button>

      <img alt="logo" src={logo} className="h-16 mx-auto mb-5" />

      {/* Campo de Email */}
      <InputForm
        name="email"
        control={control}
        label="Email"
        type="email"
        error={errors.email?.message}
        description="You will use this email to interact with Tokunize."
        autocomplete="email"
      />

      {/* Campos para el nombre y apellido */}
      <div className="grid grid-cols-2 gap-4">
        <InputForm
          name="username"
          control={control}
          label="First Name"
          type="text"
          error={errors.username?.message}
          autocomplete="given-name"
        />
        <InputForm
          name="lastName"
          control={control}
          label="Last Name"
          type="text"
          error={errors.lastName?.message}
          autocomplete="family-name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputForm
            name="password"
            control={control}
            label="Password"
            error={errors.password?.message}
            type="password"
            autocomplete="new-password"
          />
          <InputForm
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
            error={errors.confirmPassword?.message}
            autocomplete="new-password"
          />     
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
