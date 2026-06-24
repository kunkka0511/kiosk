import { adminConfigured, createAdminSession, validAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return Response.json({ error: "Admin environment variables тохируулаагүй байна." }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!validAdminCredentials(username, password)) {
    return Response.json({ error: "Нэвтрэх нэр эсвэл нууц үг буруу байна." }, { status: 401 });
  }
  await createAdminSession(username);
  return Response.json({ success: true });
}
