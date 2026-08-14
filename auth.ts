import type { NextAuthOptions } from "next-auth";
import type { ObjectId } from "mongodb";
import GoogleProvider from "next-auth/providers/google";

import { getTeleprompterCollection } from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? ""
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user }) {
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
          plan?: { isPremium?: boolean; name?: string };
        }>({
            kind: "user",
            email
          });

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.name = dbUser.name ?? token.name;
          token.picture = dbUser.image ?? token.picture;
          token.isPremium = Boolean(dbUser.plan?.isPremium);
          token.planName = dbUser.plan?.name ?? "Free";
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
      }

      return session;
    }
  }
};
