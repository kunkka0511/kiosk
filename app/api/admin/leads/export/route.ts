import { isAdminSessionValid } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads";

export const runtime = "nodejs";

const columns = [
  "createdAt", "name", "phone", "project", "room", "area", "paymentType",
  "note", "source", "formName", "pageUrl", "status",
] as const;

const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export async function GET() {
  if (!(await isAdminSessionValid())) {
    return Response.json({ error: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }
  const leads = listLeads();
  const csv = [
    columns.join(","),
    ...leads.map((lead) => columns.map((column) => csvCell(lead[column])).join(",")),
  ].join("\r\n");
  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mandala-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
