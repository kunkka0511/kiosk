import { isAdminSessionValid } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "./AdminLoginForm";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminSessionValid()) redirect("/admin/leads");
  return (
    <main className={styles.viewport}>
      <AdminLoginForm />
    </main>
  );
}
