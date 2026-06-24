import { createLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Хүсэлтийн мэдээлэл буруу байна." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const project = typeof body.project === "string" ? body.project.trim() : "";
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Нэрээ оруулна уу.";
  if (!phone) errors.phone = "Утасны дугаараа оруулна уу.";
  else if (!/^[+\d][\d\s()-]{6,19}$/.test(phone)) errors.phone = "Утасны дугаараа зөв оруулна уу.";
  if (!project) errors.project = "Сонирхож буй төслөө сонгоно уу.";
  if (Object.keys(errors).length) {
    return Response.json({ error: "Мэдээллээ шалгана уу.", errors }, { status: 400 });
  }

  try {
    const lead = createLead({
      name,
      phone,
      project,
      room: String(body.room || ""),
      area: String(body.area || ""),
      paymentType: String(body.paymentType || ""),
      note: String(body.note || ""),
      source: String(body.source || "kiosk_qr_mobile"),
      screen: String(body.screen || ""),
      formName: "mandala_qr_mobile_price_form",
      pageUrl: String(body.pageUrl || request.url),
      userAgent: request.headers.get("user-agent") || String(body.userAgent || ""),
    });
    return Response.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead save failed", error);
    return Response.json({ error: "Мэдээлэл хадгалахад алдаа гарлаа. Дахин оролдоно уу." }, { status: 500 });
  }
}
