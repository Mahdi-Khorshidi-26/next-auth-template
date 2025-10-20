"use server";
import { signIn, signOut, auth } from "@/auth";
import { prisma } from "./prisma";

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

export const getUserFromSession = async () => {
  return await auth();
};

export const getUserFromDatabase = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};
