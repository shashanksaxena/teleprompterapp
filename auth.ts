import type { NextAuthOptions } from "next-auth";
import type { ObjectId } from "mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { getTeleprompterCollection } from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? ""
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;
        const expectedUsername = process.env.ADMIN_USERNAME;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!username || !password || !expectedUsername || !passwordHash || username !== expectedUsername) {
          return null;
        }

        const [salt, storedHash] = passwordHash.split(":");
        if (!salt || !storedHash) {
          return null;
        }

        const derivedHash = scryptSync(password, salt, 64).toString("hex");
        const matches = timingSafeEqual(Buffer.from(derivedHash, "hex"), Buffer.from(storedHash, "hex"));

        return matches ? { id: "admin", name: "Administrator", email: "admin@localhost", isAdmin: true } : null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user }) {
      if (user.isAdmin) {
        return true;
      }

      if (!user.email) {
        return false;
      }

      try {
        const collection = await getTeleprompterCollection();

        await collection.updateOne(
          { kind: "user", email: user.email },
          {
            $set: {
              kind: "user",
              email: user.email,
              name: user.name ?? "Creator",
              image: user.image ?? null,
              lastSeenAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            $setOnInsert: {
              createdAt: new Date().toISOString(),
              plan: {
                name: "Free",
                isPremium: false,
                priceInr: 0,
                billingCycle: "monthly",
                status: "active"
              }
            }
          },
          { upsert: true }
        );
      } catch (error) {
        console.warn("Sign-in continuing without MongoDB persistence.", error);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.isAdmin) {
        token.isAdmin = true;
        token.userId = "admin";
        token.name = "Administrator";
        return token;
      }

      if (token.isAdmin) {
        return token;
      }

      const email = user?.email ?? token.email;
      if (!email) {
        return token;
      }

      try {
        const collection = await getTeleprompterCollection();
        const dbUser = await collection.findOne<{
          _id: ObjectId;
          name?: string;
          image?: string;
          downloadCount?: number;
          plan?: { isPremium?: boolean; name?: string; expiresAt?: string };
        }>({
          kind: "user",
          email
        });

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.name = dbUser.name ?? token.name;
          token.picture = dbUser.image ?? token.picture;
          token.isPremium = Boolean(dbUser.plan?.isPremium && dbUser.plan.expiresAt && new Date(dbUser.plan.expiresAt).getTime() > Date.now());
          token.planName = dbUser.plan?.name ?? "Free";
          token.freeDownloadsRemaining = Math.max(0, 3 - Number(dbUser.downloadCount ?? 0));
        }
      } catch (error) {
        console.warn("JWT session continuing without MongoDB lookup.", error);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.isPremium = Boolean(token.isPremium);
        session.user.planName = String(token.planName ?? "Free");
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.freeDownloadsRemaining = Number(token.freeDownloadsRemaining ?? 0);
      }

      return session;
    }
  }
};
