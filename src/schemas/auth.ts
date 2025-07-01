import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Enter a valid email address"),
    phone_number: z.string().min(7, "Phone must be at least 7 digits").max(15),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(100),
    gender: z.enum(["MALE", "FEMALE"], {
      required_error: "Gender is required",
    }),
    image: z
      .any()
      .refine(
        (v) => {
          if (!v || (v instanceof FileList && v.length === 0)) return true;
          const file = v instanceof FileList ? v.item(0) : v;
          if (!file || typeof file.type !== "string") return false;
          const isImage = file.type.startsWith("image/");
          const isSmallEnough = file.size < 2 * 1024 * 1024; // < 2MB
          return isImage && isSmallEnough;
        },
        {
          message: "Must be an image under 2MB",
        }
      )
      .optional(),
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const registerRoteSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Enter a valid email address"),
    phone_number: z.string().min(7, "Phone must be at least 7 digits").max(15),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(100),
    gender: z.enum(["MALE", "FEMALE"], {
      required_error: "Gender is required",
    }),
    image: z.string().optional().or(z.literal("")),
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Invalid token"),
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterRoteFormValues = z.infer<typeof registerRoteSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
