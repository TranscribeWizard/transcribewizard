import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {prisma} from '@/lib/db'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session({ session, user }) {
          if (session.user) {
            session.user.id = user.id;
            // session.user.role = user.role; <-- put other properties on the session here
          }
          return session;
        },
      },
      secret:process.env.NEXTAUTH_SECRET,
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
      ],  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
