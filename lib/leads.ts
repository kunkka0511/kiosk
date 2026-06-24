import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export type LeadInput = {
  name: string;
  phone: string;
  project: string;
  room?: string;
  area?: string;
  paymentType?: string;
  note?: string;
  source?: string;
  screen?: string;
  formName?: string;
  pageUrl?: string;
  userAgent?: string;
};

export type Lead = Required<Omit<LeadInput, "screen">> & {
  id: string;
  screen: string;
  status: string;
  createdAt: string;
};

let database: DatabaseSync | null = null;

function getDatabase() {
  if (database) return database;
  const file = path.join(process.cwd(), "data", "leads.sqlite");
  mkdirSync(path.dirname(file), { recursive: true });
  database = new DatabaseSync(file);
  database.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      project TEXT NOT NULL,
      room TEXT NOT NULL DEFAULT '',
      area TEXT NOT NULL DEFAULT '',
      paymentType TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL,
      screen TEXT NOT NULL DEFAULT '',
      formName TEXT NOT NULL,
      pageUrl TEXT NOT NULL DEFAULT '',
      userAgent TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
  `);
  return database;
}

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export function createLead(input: LeadInput): Lead {
  const lead: Lead = {
    id: crypto.randomUUID(),
    name: clean(input.name, 120),
    phone: clean(input.phone, 40),
    project: clean(input.project, 120),
    room: clean(input.room, 80),
    area: clean(input.area, 80),
    paymentType: clean(input.paymentType, 120),
    note: clean(input.note, 1200),
    source: clean(input.source, 120) || "kiosk_qr_mobile",
    screen: clean(input.screen, 120),
    formName: clean(input.formName, 160) || "mandala_qr_mobile_price_form",
    pageUrl: clean(input.pageUrl, 1000),
    userAgent: clean(input.userAgent, 600),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  getDatabase().prepare(`
    INSERT INTO leads (
      id, name, phone, project, room, area, paymentType, note,
      source, screen, formName, pageUrl, userAgent, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    lead.id, lead.name, lead.phone, lead.project, lead.room, lead.area,
    lead.paymentType, lead.note, lead.source, lead.screen, lead.formName,
    lead.pageUrl, lead.userAgent, lead.status, lead.createdAt,
  );
  return lead;
}

export function listLeads(search = ""): Lead[] {
  const db = getDatabase();
  const term = clean(search, 120);
  if (!term) {
    return db.prepare("SELECT * FROM leads ORDER BY createdAt DESC").all() as unknown as Lead[];
  }
  const like = `%${term}%`;
  return db.prepare(`
    SELECT * FROM leads
    WHERE name LIKE ? OR phone LIKE ? OR project LIKE ?
    ORDER BY createdAt DESC
  `).all(like, like, like) as unknown as Lead[];
}
