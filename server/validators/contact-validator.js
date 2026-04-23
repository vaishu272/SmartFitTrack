import { z } from "zod";

// contact validation schema
export const contactSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .trim()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(30, { message: "Username must not exceed 30 characters" }),

    email: z
      .email({
        required_error: "Email is required",
        message: "Please enter a valid email address",
      })
      .trim(),

    message: z
      .string({ required_error: "Message is required" })
      .trim()
      .min(1, { message: "Message cannot be empty" }),
  })
  .strict();
