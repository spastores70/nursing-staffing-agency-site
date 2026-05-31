import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/register/complete",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.NURSE,
          status: UserStatus.PENDING,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        if (user.status === UserStatus.SUSPENDED) {
          throw new Error("Your account has been suspended");
        }

        if (user.status === UserStatus.REJECTED) {
          throw new Error("Your account registration was rejected");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.status = (user as any).status;
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
        token.role = session.role;
        token.status = session.status;
      }

      // Refresh user data on each request (every 5 min)
      if (token.id && Date.now() - (token.lastRefresh as number || 0) > 5 * 60 * 1000) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, status: true, name: true, image: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.name = dbUser.name;
          token.image = dbUser.image;
          token.lastRefresh = Date.now();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as UserStatus;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser && existingUser.status === UserStatus.SUSPENDED) {
          return false;
        }

        if (!existingUser) {
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              status: UserStatus.PENDING,
              role: UserRole.NURSE,
            },
          });
        }
      }
      return true;
    },
  },
};

export const getSession = () => getServerSession(authOptions);

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      nurseProfile: true,
      facilityProfile: true,
    },
  });

  return user;
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}
