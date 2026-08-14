import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      isPremium: boolean;
      planName: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    isPremium?: boolean;
    planName?: string;
  }
}
