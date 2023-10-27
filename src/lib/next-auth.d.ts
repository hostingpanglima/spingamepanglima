import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type User = {
    id: string
    username:string
    // accessToken: string
}

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
      /** OpenID ID Token */
      user: User | AdapterUser
    }
  }