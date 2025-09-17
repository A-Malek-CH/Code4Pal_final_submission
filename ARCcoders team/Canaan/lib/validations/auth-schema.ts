import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }) // Keep min/max for overall length
    .max(32, { message: "Password must be at most 32 characters long." })
    .refine((data) => /[A-Z]/.test(data), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((data) => /[a-z]/.test(data), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((data) => /\d/.test(data), {
      // or /[0-9]/
      message: "Password must contain at least one number.",
    })
    // Optional: If you also want to restrict special characters or enforce them
    // .refine((data) => /[^A-Za-z0-9]/.test(data), { // Example: must contain one special character
    //   message: "Password must contain at least one special character.",
    // })
    .refine((data) => /^[A-Za-z\d@$!%*?&^-_.]{8,32}$/.test(data), {
      // Example: only allow these characters overall
      message:
        "Password contains invalid characters. Only letters, numbers, and @$!%*?&^-_. are allowed.",
    }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export const registerFormSchema = z.object({
  displayName: z
    .string()
    .min(2, { message: "Display name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  passwordData: z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(32, { message: "Password must be at most 32 characters long." })
        .refine((data) => /[A-Z]/.test(data), {
          message: "Password must contain at least one uppercase letter.",
        })
        .refine((data) => /[a-z]/.test(data), {
          message: "Password must contain at least one lowercase letter.",
        })
        .refine((data) => /\d/.test(data), {
          message: "Password must contain at least one number.",
        })
        .refine((data) => /^[A-Za-z\d@$!%*?&^-_.]{8,32}$/.test(data), {
          message:
            "Password contains invalid characters. Only letters, numbers, and @$!%*?&^-_. are allowed.",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
    }),
});
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
