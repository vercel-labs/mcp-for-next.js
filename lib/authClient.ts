import { createAuthClient } from "better-auth/client";
import { oidcClient } from "better-auth/client/plugins";
const authClient = createAuthClient({
  plugins: [oidcClient()],
});

export default authClient;
