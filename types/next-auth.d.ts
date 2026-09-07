import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      isPremium: boolean;
      planName: string;
      isAdmin: boolean;
      freeDownloadsRemaining: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    isPremium?: boolean;
    planName?: string;
    isAdmin?: boolean;
    freeDownloadsRemaining?: number;
  }
}
