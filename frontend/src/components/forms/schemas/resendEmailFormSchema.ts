import { z } from "zod";

// Esquema de validación para el email
export const resendEmailSchema = z.object({
  user_email: z
    .string()
    .email("Please enter a valid email address") // Valida que sea un email
    .min(5, "Email must be at least 5 characters long") // Longitud mínima
    .max(100, "Email must not exceed 100 characters"), // Longitud máxima
});

// Tipo inferido del esquema
export type ResendEmailFormValues = z.infer<typeof resendEmailSchema>;
