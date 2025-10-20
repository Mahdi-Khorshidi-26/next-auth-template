"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import passwordMatchValidationSchema from "@/validation/passwordMatchValidation";
import { compare, hash } from "bcryptjs";
import { error } from "console";

export async function updatePassword({
  password,
  confirmPassword,
  token,
}: {
  password: string;
  confirmPassword: string;
  token: string;
}) {
  try {
    let tokenIsValid = false;
    const session = await auth();
    if (!session?.user?.email) {
      return { error: true, message: "No user currently logged in" };
    }
    const updatePasswordSchema = passwordMatchValidationSchema;
    const validatedData = updatePasswordSchema.safeParse({
      password,
      confirmPassword,
    });
    if (!validatedData.success) {
      return {
        error: true,
        message: "Invalid input",
        tokenIsValid,
      };
    }

    if (token) {
      const passwordResetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
      });
      const now = Date.now();
      const databaseToken = passwordResetToken?.token;
      if (
        passwordResetToken &&
        databaseToken &&
        passwordResetToken.expiresAt.getTime() > now
      ) {
        tokenIsValid = true;
      }
    }

    if (!tokenIsValid) {
      return { error: true, message: "Invalid or expired token", tokenIsValid };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: true, message: "User not found", tokenIsValid };
    }
    const hashedNewPassword = await hash(validatedData.data.password, 10);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedNewPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return {
      error: false,
      message: "Password changed successfully",
      tokenIsValid,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      error: true,
      message: "Failed to change password",
      tokenIsValid: false,
    };
  }
}
