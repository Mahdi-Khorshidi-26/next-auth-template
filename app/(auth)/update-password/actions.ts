"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import passwordMatchValidationSchema from "@/validation/passwordMatchValidation";
import { compare, hash } from "bcryptjs";

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
      return { error: true, message: "Invalid input" };
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: true, message: "User not found" };
    }
    const passwordMatch = await compare(password, user.password!);
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
