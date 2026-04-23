import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(60, { message: "Name must not exceed 60 characters" }),

    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email({
        message: "Please enter a valid email address",
      })
      .refine((val) => !val.endsWith(".com.com"), {
        message: "Invalid domain structure (.com.com is not allowed)",
      }),

    phone: z.string().trim().max(20).optional(),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
          "Password must contain uppercase, lowercase, number and special character",
      }),
  })
  .strict();

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email" })
    .refine((val) => !val.endsWith(".com.com"), {
      message: "Invalid domain structure (.com.com is not allowed)",
    }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const onboardingSchema = z.object({
  height: z.coerce
    .number({ required_error: "Height is required", invalid_type_error: "Height must be a number" })
    .min(50, "Height must be at least 50cm")
    .max(300, "Height must be at most 300cm"),
  weight: z.coerce
    .number({ required_error: "Weight is required", invalid_type_error: "Weight must be a number" })
    .min(20, "Weight must be at least 20kg")
    .max(400, "Weight must be at most 400kg"),
  age: z.coerce
    .number({ required_error: "Age is required", invalid_type_error: "Age must be a number" })
    .min(10, "Age must be at least 10")
    .max(120, "Age must be at most 120"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
  fitnessGoal: z.enum(["Weight Loss", "Muscle Gain", "Maintenance", "General Fitness"], { required_error: "Goal is required" }),
}).strict();
