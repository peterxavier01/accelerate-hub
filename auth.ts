import NextAuth, { Session, User, Profile, Account } from "next-auth";
import { JWT } from "next-auth/jwt";
import github from "next-auth/providers/github";

import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

declare module "next-auth" {
  interface Session {
    id: string;
  }

  interface jwt {
    id: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [github],
  callbacks: {
    async signIn({ user, profile }: { user: User; profile?: Profile }) {
      if (profile) {
        const { id, login, bio } = profile;
        const { name, email, image } = user;

        const existingUser = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id,
            name,
            username: login,
            email,
            image,
            bio: bio || "",
          });
        }
      }

      return true;
    },

    async jwt({ token, account, profile }: { token: JWT; account: Account | null; profile?: Profile }) {
      if (account && profile) {
        const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });
        token.id = user?._id;
      }

      return token;
    },


    async session({ session, token }: { session: Session, token: JWT }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  }
});
