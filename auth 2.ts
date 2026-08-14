import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { getDb } from "@/lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
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

      const db = await getDb();

      await db.collection("users").updateOne(
        { email: user.email },
        {
          $set: {
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

      return true;
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (!email) {
        return token;
      }

      const db = await getDb();
      const dbUser = await db.collection("users").findOne<{ _id: { toString(): string }; name?: string; image?: string; plan?: { isPremium?: boolean; name?: string } }>({
        email
      });

      if (dbUser) {
        token.userId = dbUser._id.toString();
        token.name = dbUser.name ?? token.name;
        token.picture = dbUser.image ?? token.picture;
        token.isPremium = Boolean(dbUser.plan?.isPremium);
        token.planName = dbUser.plan?.name ?? "Free";
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
});
