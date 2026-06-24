import { isAdminSessionValid } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads";
import { redirect } from "next/navigation";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await isAdminSessionValid())) redirect("/admin/login");
  const { q = "" } = await searchParams;
  const leads = listLeads(q);

  return (
    <main className={styles.viewport}>
      <section className={styles.adminShell}>
        <header className={styles.adminHeader}>
          <div><p>MANDALA GARDEN</p><h1>Lead хүсэлтүүд</h1><span>Нийт {leads.length} хүсэлт</span></div>
          <div className={styles.headerActions}>
            <a href="/api/admin/leads/export">CSV татах</a>
            <form action="/api/admin/logout" method="post"><button>Гарах</button></form>
          </div>
        </header>

        <form className={styles.search} method="get">
          <input name="q" defaultValue={q} placeholder="Нэр, утас, төслөөр хайх" />
          <button>Хайх</button>
          {q && <a href="/admin/leads">Цэвэрлэх</a>}
        </form>

        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Огноо</th><th>Нэр</th><th>Утас</th><th>Төсөл</th><th>Өрөө</th><th>м²</th><th>Төлбөр</th><th>Тайлбар</th><th>Эх сурвалж</th><th>Статус</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Intl.DateTimeFormat("mn-MN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ulaanbaatar" }).format(new Date(lead.createdAt))}</td>
                  <td><strong>{lead.name}</strong></td><td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td>
                  <td>{lead.project}</td><td>{lead.room || "—"}</td><td>{lead.area || "—"}</td>
                  <td>{lead.paymentType || "—"}</td><td className={styles.note}>{lead.note || "—"}</td>
                  <td>{lead.source}</td><td><span className={styles.status}>{lead.status}</span></td>
                </tr>
              ))}
              {!leads.length && <tr><td className={styles.empty} colSpan={10}>Одоогоор lead мэдээлэл алга.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
