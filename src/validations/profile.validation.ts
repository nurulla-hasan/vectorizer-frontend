import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(100, { error: "Name cannot exceed 100 characters." }),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^01[3-9]\d{8}$/.test(val),
      {
        error:
          "Enter a valid 11-digit Bangladeshi number (e.g. 01712345678) or leave empty.",
      },
    ),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      { error: "Enter a valid image URL (https://...) or leave empty." },
    ),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
