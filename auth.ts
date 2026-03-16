import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const allowedEmail = process.env.MYSPACE_ADMIN_USERNAME ?? '';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/myspace/admin',
    error: '/myspace/admin',
  },
  callbacks: {
    signIn({ profile }) {
      if (!allowedEmail) return false;
      return profile?.email === allowedEmail;
    },
    session({ session }) {
      return session;
    },
  },
});
