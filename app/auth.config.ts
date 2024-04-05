import type {NextAuthConfig} from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: function ({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log("logged in");
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      else if(isLoggedIn){
          return Response.redirect(new URL("/dashboard",nextUrl));
      }
      return true;
    },
  },
    providers:[]
} satisfies NextAuthConfig;
