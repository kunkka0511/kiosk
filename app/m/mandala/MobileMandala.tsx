"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import styles from "./mobile.module.css";

const rooms = ["2 өрөө", "3 өрөө", "4 өрөө", "5 өрөө+", "Duplex / Premium"];
const areas = ["60–80 м²", "80–100 м²", "100–150 м²", "150 м²+"];
const highlights = [
  ["🌿", "Ногоон байгууламж"],
  ["🚶", "Автомашингүй дотоод орчин"],
  ["🏡", "Гэр бүлийн амьдралд тохирсон төлөвлөлт"],
  ["🎓", "Сургууль, цэцэрлэг, үйлчилгээний орчин"],
  ["☀️", "Явган зам, амрах бүс"],
];
const gallery = [
  "/assets/images/fbouz.jpg",
  "/assets/All edited.jpg",
  "/assets/toim/deeres%20avsan%20untsug.jpg",
  "/assets/toim/3x3%20talbai.jpg",
  "/assets/amenities/green/ongo7%20sky.png",
];

type FormState = {
  name: string; phone: string; project: string; room: string;
  area: string; paymentType: string; note: string;
};

const initialForm: FormState = {
  name: "", phone: "", project: "Mandala Garden", room: "",
  area: "", paymentType: "", note: "",
};

export default function MobileMandala() {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const choose = (field: "room" | "area", value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openForm = () => {
    setSuccess(false);
    setErrors({});
    setFormOpen(true);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Нэрээ оруулна уу.";
    if (!form.phone.trim()) nextErrors.phone = "Утасны дугаараа оруулна уу.";
    if (!form.project) nextErrors.project = "Сонирхож буй төслөө сонгоно уу.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const query = new URLSearchParams(window.location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: query.get("source") || "kiosk_qr_mobile",
          screen: query.get("screen") || "",
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors || { form: data.error || "Алдаа гарлаа. Дахин оролдоно уу." });
        return;
      }
      setSuccess(true);
      setForm(initialForm);
    } catch {
      setErrors({ form: "Сүлжээний алдаа гарлаа. Дахин оролдоно уу." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.viewport}>
      <div className={styles.phone}>
        <section className={styles.hero}>
          <Image className={styles.logo} src="/assets/logo/mandala-garden-logo.png" alt="Mandala Garden" width={120} height={94} priority />
          <div className={styles.heroCopy}>
            <span>MANDALA GARDEN</span>
            <h1>Гэр бүлд зориулсан ногоон хотхон</h1>
            <p>Mandala Garden хотхоны төлөвлөлт, давуу тал болон орон сууцны сонголттой утсаараа танилцаарай.</p>
            <div className={styles.heroActions}>
              <button onClick={openForm}>Үнэ авах</button>
              <button className={styles.secondary} onClick={openForm}>Зөвлөгөө авах</button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>ТӨСЛИЙН ДАВУУ ТАЛ</p>
          <h2>Гэр бүлийн өдөр бүрт зориулсан орчин</h2>
          <div className={styles.highlightGrid}>
            {highlights.map(([icon, title]) => (
              <article key={title}><span>{icon}</span><strong>{title}</strong></article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.gallerySection}`}>
          <p className={styles.eyebrow}>ТАНИЛЦУУЛГА</p>
          <h2>Mandala Garden орчин</h2>
          <div className={styles.gallery}>
            {gallery.map((src, index) => <Image key={src} src={src} alt={`Mandala Garden зураг ${index + 1}`} width={360} height={260} />)}
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>ТАНЫ СОНИРХОЛ</p>
          <h2>Ямар сонголт хайж байна вэ?</h2>
          <h3>Өрөө</h3>
          <div className={styles.chips}>
            {rooms.map((room) => <button key={room} className={form.room === room ? styles.activeChip : ""} onClick={() => choose("room", room)}>{room}</button>)}
          </div>
          <h3>Талбай</h3>
          <div className={styles.chips}>
            {areas.map((area) => <button key={area} className={form.area === area ? styles.activeChip : ""} onClick={() => choose("area", area)}>{area}</button>)}
          </div>
        </section>

        <section className={styles.finalCta}>
          <h2>Дэлгэрэнгүй мэдээлэл аваарай</h2>
          <p>Үнэ болон төлбөрийн нөхцөлийн дэлгэрэнгүй мэдээлэл авах бол мэдээллээ үлдээнэ үү.</p>
          <button onClick={openForm}>Мэдээлэл авах</button>
        </section>

        <footer>Mandala Garden · 7575-8000</footer>

        {formOpen && (
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Мэдээлэл авах хүсэлт">
            <div className={styles.formCard}>
              <button className={styles.close} onClick={() => setFormOpen(false)} aria-label="Хаах">×</button>
              {success ? (
                <div className={styles.success}>
                  <span>✓</span>
                  <h2>Баярлалаа</h2>
                  <p>Таны мэдээлэл амжилттай бүртгэгдлээ. Борлуулалтын зөвлөх тантай холбогдох болно.</p>
                  <button onClick={() => setFormOpen(false)}>Хаах</button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <p className={styles.eyebrow}>ҮНЭ · ЗӨВЛӨГӨӨ</p>
                  <h2>Мэдээллээ үлдээнэ үү</h2>
                  {errors.form && <p className={styles.formError}>{errors.form}</p>}
                  <label>Нэр *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name)} />
                  {errors.name && <small>{errors.name}</small>}
                  <label>Утасны дугаар *</label>
                  <input inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone && <small>{errors.phone}</small>}
                  <label>Сонирхож буй төсөл *</label>
                  <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
                    <option>Mandala Garden</option><option>Mandala 360</option><option>Mandala 365</option>
                  </select>
                  <div className={styles.formRow}>
                    <div><label>Өрөөний сонголт</label><select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}><option value="">Сонгох</option>{rooms.map((x) => <option key={x}>{x}</option>)}</select></div>
                    <div><label>м² хэмжээ</label><select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}><option value="">Сонгох</option>{areas.map((x) => <option key={x}>{x}</option>)}</select></div>
                  </div>
                  <label>Төлбөрийн хэлбэр</label>
                  <select value={form.paymentType} onChange={(e) => setForm({ ...form, paymentType: e.target.value })}>
                    <option value="">Сонгох</option><option>Бэлэн төлөлт</option><option>Банкны зээл</option><option>Компанийн нөхцөл</option><option>Barter / Солилцоо</option><option>Мэдэхгүй, зөвлөгөө авна</option>
                  </select>
                  <label>Нэмэлт тайлбар</label>
                  <textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                  <button className={styles.submit} disabled={submitting}>{submitting ? "Илгээж байна…" : "Хүсэлт илгээх"}</button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
