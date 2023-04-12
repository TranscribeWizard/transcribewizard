import { type NextAuthOptions,getServerSession } from 'next-auth';
import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          // session.user.role = user.role; <-- put other properties on the session here
        }
        return session;
      },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
  
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
  };

  

export default NextAuth(authOptions);
export const getServerAuthSession = () => {
    return getServerSession(authOptions);
  };

