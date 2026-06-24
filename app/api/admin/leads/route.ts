import { isAdminSessionValid } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminSessionValid())) {
    return Response.json({ error: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }
  const search = new URL(request.url).searchParams.get("q") || "";
  const leads = listLeads(search);
  return Response.json({ leads, total: leads.length });
}
