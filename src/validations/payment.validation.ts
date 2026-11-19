import { z } from "zod";

export const paymentSubmissionSchema = z.object({
  senderNumber: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, {
      error: "Enter a valid 11-digit Bangladeshi mobile number.",
    }),
  transactionId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,30}$/, {
      error: "Transaction ID must be 6-30 letters or digits.",
    }),
});

export type PaymentSubmissionInput = z.infer<typeof paymentSubmissionSchema>;
