"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Нэвтрэх нэр болон нууц үгээ оруулна уу.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Нэвтрэх боломжгүй байна.");
        return;
      }
      window.location.assign("/admin/leads");
    } catch {
      setError("Сүлжээний алдаа гарлаа.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.loginCard} onSubmit={submit}>
      <Image src="/assets/logo/mandala-garden-logo.png" alt="Mandala Garden" width={120} height={94} priority />
      <p>ADMIN PANEL</p>
      <h1>Lead мэдээлэл</h1>
      {error && <div className={styles.error}>{error}</div>}
      <label>Нэвтрэх нэр</label>
      <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label>Нууц үг</label>
      <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={busy}>{busy ? "Нэвтэрч байна…" : "Нэвтрэх"}</button>
    </form>
  );
}
