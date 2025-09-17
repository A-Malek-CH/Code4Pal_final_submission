import { z } from "zod";
import { UserRole } from "@/types/user";
export const updateAdminProfileFormSchema = z.object({
  displayName: z
    .string()
    .min(2, { message: "Display name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  app_role: z.enum([
    Object.values(UserRole)[0],
    ...Object.values(UserRole).slice(1),
  ] as const),
  photoURL: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
});

export type UpdateAdminProfileFormValues = z.infer<
  typeof updateAdminProfileFormSchema
>;
