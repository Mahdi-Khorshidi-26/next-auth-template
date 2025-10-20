"use server";

import passwordMatchValidationSchema from "@/validation/passwordMatchValidation";
import z from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
export default async function registerUser({
  email,
  password,
  confirmPassword,
}: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const newUserValidationSchema = z
      .object({
        email: z.string().email("Invalid email address"),
      })
      .and(passwordMatchValidationSchema);

    const validatedData = newUserValidationSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validatedData.success) {
      return {
        error: true,
        message: validatedData.error.issues[0].message,
      };
    }
    const hashedPassword = await hash(validatedData.data.password, 10);

    await prisma.user.create({
      data: {
        email: validatedData.data.email,
        password: hashedPassword,
      },
    });
    return { error: false, message: "User registered successfully" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.cause?.code === "23505" || e.code === "23505") {
      return {
        error: true,
        message: "An account is already registered with this email",
      };
    }
    return { error: true, message: e?.message || "Something went wrong" };
  }
}
