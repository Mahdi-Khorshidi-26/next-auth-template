"use server";
import { getUserFromDatabase } from "@/lib/globalActions";
import { prisma } from "@/lib/prisma";
import passwordMatchValidationSchema from "@/validation/passwordMatchValidation";
import { hash } from "bcryptjs";

export async function updatePassword({
  password,
  confirmPassword,
  token,
  email,
}: {
  password: string;
  confirmPassword: string;
  token: string;
  email: string;
}) {
  try {
    let tokenIsValid = false;
    const user = await getUserFromDatabase(email);
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

    if (!user) {
      return { error: true, message: "User not found", tokenIsValid };
    }
    const hashedNewPassword = await hash(validatedData.data.password, 10);
    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedNewPassword },
    });

    if (token) {
      await prisma.passwordResetToken.delete({
        where: { token },
      });
    }

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
