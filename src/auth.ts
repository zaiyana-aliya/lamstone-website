import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = createServerSupabaseClient();
        const { data: user, error } = await supabase
          .from("admin_users")
          .select("id, email, password_hash, role")
          .eq("email", String(credentials.email).toLowerCase())
          .maybeSingle();

        if (error || !user) return null;

        const passwordMatch = await bcrypt.compare(
          String(credentials.password),
          user.password_hash
        );
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.role,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
});
