import z from "zod";
import passwordValidationSchema from "./passwordValidation";

const passwordMatchValidationSchema = z
  .object({
    password: passwordValidationSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export default passwordMatchValidationSchema;
