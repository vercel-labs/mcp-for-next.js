import authClient from "./authClient";

const application = await authClient.oauth2.register({
  redirect_uris: ["http://localhost:3000/callback"],
});

export default application;
