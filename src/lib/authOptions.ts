// import { Login } from '@/services/authServices';
import { db } from '@/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcrypt"

export const authOptions:NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: "username"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                if(!credentials?.username || !credentials.password)
                    return null
                const user = await db.user.findUnique({
                    where: {
                        username: credentials.username.toLowerCase()
                    }
                })
                if(user && await bcrypt.compare(credentials.password, user.password)){
                    user.password=""
                    return user
                }
                return null
            },
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: "/admin"
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if(user)
                token.user = user
            return token;
        },
        session: async ({session,token}) => {
            if(token)
                session.user = token.user 
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development"
}