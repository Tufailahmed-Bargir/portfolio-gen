import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/db";

declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name: string;
        email: string;
        image: string;
        role: string;
      };
      provider: string; // Pass the provider to the session
    }
  
    interface User {
      role?: string;
    }
  }

export const authOptions: NextAuthOptions = {
    providers: [
    //   GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    //   }),
      // Uncomment the following section to enable Google OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    ],
    session: {
      strategy: "jwt", // Use JWT for session management
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      maxAge: 60 * 60 * 24 * 30, // JWT token expiry (30 days)
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        if (!user.email || !user.name) {
          return false; // Reject sign-in if user info is incomplete
        }
  
        const adminEmail = process.env.ADMIN_EMAIL;
        const role = user.email === adminEmail ? "ADMIN" : "USER";
  
        if (account){
          console.log(`Signing in user: ${user.email} via ${account.provider}`);
        }
        console.log("Assigned role:", role);
  
        // Check if user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
  
        if (existingUser) {
          // Update user if they already exist
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: user.name,
              image: user.image ?? undefined, // Error 
              role: role,
            },
          });
        } else {
          // Create new user if they don't exist
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image ?? undefined, // Error 
              provider: account?.provider ?? "unknown",  // Error: 'account' is possibly 'null'.ts(18047)
              // (parameter) account: Account | null
              // Store the provider (Google or GitHub)
            },
          });
        }
  
        user.role = role; // Assign role to user object
        return true; // Sign-in allowed
      },
      async jwt({ token, user, account }) {
        if (user) {
          token.role = user.role;
          token.provider = account?.provider; // Store provider in the token
        }
        return token; // Return the modified JWT token
      },
      async session({ session, token }) {
        if (token && typeof token.role === "string") {
          session.user.role = token.role; // Add role to session object
        }
        session.provider = token.provider as string; // Add type assertion to fix the error
        
        // Pass the provider to the session
        return session; // Return modified session
      },
    },
    pages: {
      signIn: "/auth/signin",
      signOut: "/auth/signout",
      error: "/auth/error", // Error page
    },
    debug: process.env.NODE_ENV === "development",
  };

function GoogleProvider(arg0: { clientId: string; clientSecret: string; }): import("next-auth/providers/index").Provider {
    throw new Error("Function not implemented.");
}
  