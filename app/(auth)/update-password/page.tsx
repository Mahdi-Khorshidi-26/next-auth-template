import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UpdatePasswordForm from "./updatePasswordForm";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParamsValues = await searchParams;
  let tokenIsValid = false;
  const { token } = searchParamsValues;

  if (token) {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    const now = Date.now();
    const databaseToken = passwordResetToken?.token;
    if (passwordResetToken && databaseToken && passwordResetToken.expiresAt.getTime() > now) {
      tokenIsValid = true;
    }
  }
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>
            {tokenIsValid
              ? "Your token is valid. You can now update your password."
              : "Invalid or expired token. Please request a new password reset."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <UpdatePasswordForm token={token ?? ""} />
          ) : (
            <Link className="underline" href={"/password-reset"}>
              Request new password reset
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
