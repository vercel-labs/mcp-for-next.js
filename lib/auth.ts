import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    oidcProvider({
      allowDynamicClientRegistration: true,
      loginPage: "/sign-in", // path to the login page
      // ...other options
    }),
  ],
});
