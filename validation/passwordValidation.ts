import z from "zod";

const passwordValidationSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");

export default passwordValidationSchema;
