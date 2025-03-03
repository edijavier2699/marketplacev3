import { z } from "zod";

export const signUpFormSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    lastName: z.string().min(1, {
      message: "Last name is required.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z
      .string()
      .min(8, { message: "At least 8 characters  long." })
      .regex(/[A-Z]/, { message: "At least one uppercase letter." })
      .regex(/[0-9]/, { message: "At least one number." })
      .regex(/[\W_]/, { message: "At least one special character." }),
    confirmPassword: z.string().min(8, { message: "Passwords must match." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type SingUpFormValues = z.infer<typeof signUpFormSchema>;
