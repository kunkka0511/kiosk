<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Mandala QR mobile lead MVP rules

- Inspect the project structure and relevant Next.js 16 documentation before editing implementation files.
- Preserve the existing kiosk design, navigation, animations, assets, components, and page flow.
- Keep the sales-manager page visually consistent; the QR card must not cover manager cards.
- Build only the requested MVP: mobile presentation, lead form/backend save, protected admin leads, CSV export, and kiosk QR entry point.
- Do not add a CMS, design editor, image upload system, CRM integration, payments, or reservations.
- Never expose admin credentials, session secrets, or API keys in frontend code. Use environment variables and update `.env.example` with placeholders only.
- Do not commit or push unless explicitly requested.
- Before implementation, present an inspect-based plan. Modify implementation files only after the user approves that plan.
- After implementation, review the diff and run the available build and lint checks.
