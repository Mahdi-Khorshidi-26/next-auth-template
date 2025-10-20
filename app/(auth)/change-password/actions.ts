"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import passwordMatchValidationSchema from "@/validation/passwordMatchValidation";
import passwordValidationSchema from "@/validation/passwordValidation";
import { compare, hash } from "bcryptjs";
import z from "zod";

export async function changePassword({
  currentPassword,
  password,
  confirmPassword,
}: {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: true, message: "No user currently logged in" };
    }
    const changePasswordSchema = z
      .object({
        currentPassword: passwordValidationSchema,
      })
      .and(passwordMatchValidationSchema);
    const validatedData = changePasswordSchema.safeParse({
      currentPassword,
      password,
      confirmPassword,
    });
    if (!validatedData.success) {
      return { error: true, message: "Invalid input" };
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: true, message: "User not found" };
    }
    const passwordMatch = await compare(currentPassword, user.password!);
    if (!passwordMatch) {
      return { error: true, message: "Current password is incorrect" };
    }
    const hashedNewPassword = await hash(validatedData.data.password, 10);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedNewPassword },
    });

    return { error: false, message: "Password changed successfully" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { error: true, message: "Failed to change password" };
  }
}
