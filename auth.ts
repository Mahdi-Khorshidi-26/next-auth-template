
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email as string },
        });
        console.log("Found user:", user);
        if (!user) {
          throw new Error("No user found with the given email");
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password as string
          );
          if (!passwordCorrect) {
            throw new Error("Incorrect password");
          }
        }
        console.log("Authorized user ID:", {
          id: user.id.toString(),
          email: user.email,
        });
        return { id: user.id.toString(), email: user.email };
      },
    }),
    GitHub,
  ],
});
