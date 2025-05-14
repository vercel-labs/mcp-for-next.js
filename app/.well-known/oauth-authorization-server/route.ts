import { auth } from "../../../lib/auth";

export async function GET(request: Request) {
  const a = await auth.api.getOpenIdConfig({
    asResponse: true,
  });

  return a;
}
