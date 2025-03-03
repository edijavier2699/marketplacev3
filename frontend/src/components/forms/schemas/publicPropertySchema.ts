import { z } from "zod";

export const publicProperty = z.object({
  applicantName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." })
    .max(100, { message: "Address cannot exceed 100 characters." }),

  nationalInsurance: z.string().regex(/^[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]{1}$/, {
    message: "Invalid National Insurance number format.",
  }),

  emailAddress: z.string().email({ message: "Invalid email address." }),

  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, {
      message: "Phone number must contain 10-15 digits and may include a '+' at the start.",
    }),

  preferredContactMethod: z.enum(["email", "phone"], {
    message: "Please specify how you prefer being contacted.",
  }),

  propertyType: z.enum(
    [
      "Office",
      "Multifamily",
      "Offices",
      "Mixed Use",
      "Hospitality",
      "Land",
      "Data Centre",
      "Industrial",
      "Warehouse",
      "Student Housing",
    ],
    { message: "Please select a valid property type." }
  ),

  onBehalf: z.string().refine((val) => val === "true" || val === "false", {
    message: "Please specify if you are submitting on behalf of someone else.",
  }),

  // Campos necesarios si se envía en nombre de alguien más
  organizationName: z.string().optional(),
  position: z.string().optional(),
  organisationType: z.string().optional(),
  registrationNumber: z.string().optional(),
  uniqueTaxReference: z
    .string()
    .regex(/^[A-Za-z0-9]{10,15}$/, {
      message: "Unique Tax Reference must be 10-15 alphanumeric characters.",
    })
    .optional(),

  isBroker: z
    .enum(["Yes", "No"], {
      message: "Please specify if you are a broker-dealer by selecting Yes or No.",
    })
    .optional(),

  relationshipExplanation: z.string().optional(),
  preferredCommunicationMethod: z.enum(["Email", "Phone"]).optional(),

  // Campos del formulario PropertyDetails
  propertyTitle: z
    .string()
    .min(1, { message: "Property title is required." })
    .max(100, { message: "Property title cannot exceed 100 characters." }),

  yearBuilt: z
    .number()
    .int()
    .min(1000, { message: "Year Built must be a valid year." })
    .max(new Date().getFullYear(), { message: "Year Built cannot be in the future." })
    .optional(),

  bedroomCount: z
    .number()
    .int()
    .min(0, { message: "Bedroom count cannot be negative." }),

  bathroomCount: z
    .number()
    .int()
    .min(0, { message: "Bathroom count cannot be negative." }),

  propertySize: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "Property size must be a positive number.",
    })
    .optional(),
  propertyLocation: z.string()

}).superRefine((data, ctx) => {
  // Validaciones condicionales cuando onBehalf es "true"
  if (data.onBehalf === "true") {
    if (!data.organizationName) {
      ctx.addIssue({
        path: ["organizationName"],
        message: "Organization name is required when submitting on behalf of someone else.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.position) {
      ctx.addIssue({
        path: ["position"],
        message: "Position/Role is required when submitting on behalf of someone else.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.organisationType) {
      ctx.addIssue({
        path: ["organisationType"],
        message: "Type of organisation is required when submitting on behalf of someone else.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.registrationNumber) {
      ctx.addIssue({
        path: ["registrationNumber"],
        message: "Business registration number is required when submitting on behalf of someone else.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.relationshipExplanation) {
      ctx.addIssue({
        path: ["relationshipExplanation"],
        message: "Please explain your relationship with this asset.",
        code: z.ZodIssueCode.custom,
      });
    }
  }
});

export type formValuesPublicProperty = z.infer<typeof publicProperty>;
