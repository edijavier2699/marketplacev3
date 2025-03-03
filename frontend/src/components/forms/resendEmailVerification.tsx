import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResendEmailFormValues, resendEmailSchema } from "./schemas/resendEmailFormSchema";
import { Button } from "../ui/button";
import axios from "axios";
import InputForm from "./inputForm";
import { useState } from "react";

const ResendEmailVerificationForm = () => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<ResendEmailFormValues>({
    resolver: zodResolver(resendEmailSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ResendEmailFormValues> = async (data) => {
    try {
      setLoading(true);
      setErrorMessage(null); // Reset previous error
      setSuccessMessage(null); // Reset previous success message

      // Make POST request to the backend for resending verification email
      await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}users/resend-email/`, {
        email: data.user_email,
      });

      // If the request is successful, show success message
      setSuccessMessage("Verification email sent successfully!");
      reset(); // Reset the form after successful submission
    } catch (error: any) {
      // If there's an error, show error message
      setErrorMessage("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputForm
        name="user_email"
        label="Email"
        control={control}
        type="email"
        error={errors.user_email?.message}
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Resend Email"}
      </Button>
    </form>
  );
};

export default ResendEmailVerificationForm;
