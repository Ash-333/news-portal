import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";
import { UserStatus } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  // pages: {
  //   signIn: '/login',
  //   error: '/login',
  // },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedCredentials = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          if (user.status !== "ACTIVE") {
            throw new Error("Account is suspended or banned");
          }

          const isValidPassword = await bcrypt.compare(
            validatedCredentials.password,
            user.passwordHash,
          );

          if (!isValidPassword) {
            return null;
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profilePhoto,
          };
        } catch {
          return null;
        }
      },
    }),
    // Credentials provider is the only login method
    // Email/password only - OAuth removed
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Handle OAuth sign in
      if (account && account.provider !== "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth, check if user exists and is active
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!dbUser) {
        // Create new user for OAuth
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            profilePhoto: user.image,
            role: "PUBLIC_USER",
            status: "ACTIVE",
          },
        });
        return true;
      }

      if (dbUser.status !== "ACTIVE") {
        return false;
      }

      // Update profile photo if changed
      if (user.image && user.image !== dbUser.profilePhoto) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            profilePhoto: user.image,
            lastLoginAt: new Date(),
          },
        });
      } else {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { lastLoginAt: new Date() },
        });
      }

      return true;
    },
  },
  events: {
    async signIn({ user, account }) {
      // Log sign in audit
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_LOGIN",
            targetType: "USER",
            targetId: user.id,
          },
        });
      }
    },
    async signOut({ token }) {
      // Log sign out audit
      if (token?.id) {
        await prisma.auditLog.create({
          data: {
            userId: token.id as string,
            action: "USER_LOGOUT",
            targetType: "USER",
            targetId: token.id as string,
          },
        });
      }
    },
  },
};

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
