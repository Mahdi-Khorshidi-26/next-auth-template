"use server";
import { mailer } from "@/lib/email";
import { getUserFromDatabase, userLoggedInStatus } from "@/lib/globalActions";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import z from "zod";

export async function resetPassword({ email }: { email: string }) {
  try {
    const loggedIn = await userLoggedInStatus();

    if (loggedIn) {
      return { error: true, message: "You are already logged in" };
    }
    const resetPasswordSchema = z.object({
      email: z.string().email("Invalid email address"),
    });

    const validatedData = resetPasswordSchema.safeParse({
      email,
    });

    if (!validatedData.success) {
      return {
        error: true,
        message: validatedData.error.issues[0].message,
      };
    }
    const user = await getUserFromDatabase(validatedData.data.email);

    if (!user) {
      return { error: true, message: "No account found with this email" };
    }

    const passwordResetToken = randomBytes(32).toString("hex");
    const expireDate = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: {
        token: passwordResetToken,
        expiresAt: expireDate,
      },
      create: {
        email: validatedData.data.email,
        userId: user.id,
        token: passwordResetToken,
        expiresAt: expireDate,
      },
    });

    // Send password reset email
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password?token=${passwordResetToken}&email=${validatedData.data.email}`;
    console.log("Reset Link:", resetLink);

    await mailer.sendMail({
      from: "test@resend.dev",
      subject: "Your Password Reset Link",
      to: validatedData.data.email,
      html: `Click the following link to reset your password: 
        this link is going to expire in 1 hour :
      <a href="${resetLink}">Reset Password</a>
      or copy and paste this URL into your browser: ${resetLink}
      `,
    });

    return { error: false, message: "Password reset link sent to email" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { error: true, message: "Incorrect email or password" };
  }
}
