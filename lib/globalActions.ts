"use server";
import { signIn, signOut, auth } from "@/auth";

export const login = async () => {
  await signIn("github", { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

export const userLoggedInStatus = async () => {
  const session = await auth();
  return !!session;
};
