"use server";

import { signIn } from "@/auth";
import passwordValidationSchema from "@/validation/passwordValidation";
import z from "zod";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const loginUserSchema = z.object({
      email: z.string().email("Invalid email address"),
      password: passwordValidationSchema,
    });

    const validatedData = loginUserSchema.safeParse({
      email,
      password,
    });

    if (!validatedData.success) {
      return {
        error: true,
        message: validatedData.error.issues[0].message,
      };
    }

    await signIn("credentials", {
      redirect: false,
      email: validatedData.data.email,
      password: validatedData.data.password,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { error: true, message: "Incorrect email or password" };
  }
}
