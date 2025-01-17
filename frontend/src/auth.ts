import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Constantes e funções auxiliares
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutos
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 dias

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
  credentials: async (user, account, profile, email, credentials) => {
    return true;
  },
  google: async (user, account, profile, email, credentials) => {
    try {
      const response = await fetch(
        `${process.env.NEXTAUTH_BACKEND_URL}google/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: account["id_token"],
          }),
        },
      );
      const data = await response.json();
      console.log("response", response);
      account["meta"] = data;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export async function signUp(credentials: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) {
  try {
    const apiUrl = process.env.NEXTAUTH_BACKEND_URL + "auth/register/";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = response.json();
    if (data) return data;
  } catch (err) {
    console.log(err);
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const apiUrl = process.env.NEXTAUTH_BACKEND_URL + "auth/login/";
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
          const data = response.json();
          if (data) return data;
        } catch (error) {
          console.error(error);
        }
        return null;
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;
      return SIGN_IN_HANDLERS[account.provider](
        user,
        account,
        profile,
        email,
        credentials,
      );
    },
    async jwt({ user, token, account }) {
      if (user && account) {
        const backendResponse =
          account.provider === "credentials" ? user : account.meta;
        token["user"] = backendResponse.user;
        token["access_token"] = backendResponse.access;
        token["refresh_token"] = backendResponse.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        return token;
      }

      if (getCurrentEpochTime() > token["ref"]) {
        const response = await fetch(
          `${process.env.NEXTAUTH_BACKEND_URL}auth/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh: token["refresh_token"],
            }),
          },
        );
        const data = await response.json();
        token["access_token"] = data.access;
        token["refresh_token"] = data.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
      }
      return token;
    },
    async session({ token }) {
      return token;
    },
  },
});
