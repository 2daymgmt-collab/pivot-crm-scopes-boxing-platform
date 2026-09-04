# Scopes Boxing Club — PDF → Sheets → WhatsApp Sync

**Goal:** Daily, automatic pipeline that reads membership data from existing PDF records, keeps a Google Sheet as the live source of truth, and pushes real-time WhatsApp updates (check-ins, balances, expirations) — replacing the manual/simulated version in the current prototype.

---

## 1. Data Flow

```
[PDF membership files]
        │  (daily, scheduled)
        ▼
[PDF Extraction Job]  →  parses each PDF into structured rows
        │
        ▼
[Google Sheet: "Members" tab]  ←── source of truth, staff can also hand-edit
        │
        ├──► [Change Detector]  →  compares today's pull vs. yesterday's
        │                            │
        │                            ▼
        │                     [WhatsApp Business API]
        │                       - check-in confirmations
        │                       - balance due / overdue alerts
        │                       - membership expiring in N days
        │                       - group session reminders
        │
        └──► [App / Kiosk] reads live from the Sheet for check-in, balances, etc.
```

## 2. Components & Tech

| Component | Purpose | Suggested tech |
|---|---|---|
| PDF Extraction Job | Pull text/tables out of membership PDFs into rows | Python (`pdfplumber` for text-based PDFs, or Google Document AI / AWS Textract if the PDFs are scanned images) |
| Scheduler | Runs the whole pipeline daily (or hourly) | Google Apps Script time-driven trigger, or a cron job on a small server / Cloud Function |
| Sheet | Structured, shared source of truth | Google Sheets, written to via the Sheets API |
| Change Detector | Figures out what's new/changed since last run (new balance, expiring membership, etc.) | Simple diff logic in the same script — compare hash of each row to last run |
| Messaging | Sends the actual WhatsApp messages | WhatsApp Business Platform (Cloud API) — requires a Meta Business account and approved message templates |
| App | The member/staff portal (what you've been testing) | Reads and writes to the same Sheet instead of in-memory data |

## 3. Sheet Schema (matches the prototype's data model)

**Members tab**

| Column | Example | Notes |
|---|---|---|
| memberNo | 1001 | 4-digit ID, used for member login |
| first | Marcus | |
| last | Alvarado | |
| tier | Rental | Rental / Monthly / Annual |
| joined | 2026-08-01 | |
| lastVisit | 2026-08-24 | updated by check-in |
| coach | T. Reyes | |
| hoursLogged | 6 | updated by check-out |
| balance | 0 | dollars owed |
| nextFeeDate | 2026-08-31 | |
| nextFeeAmount | 60 | |
| checkedInAt | (blank or timestamp) | live state |
| whatsappNumber | +1... | needed to actually message them |

**GroupSessions tab** — date, time, title, coach, attendee list, capacity, ticket price (same shape as the prototype).

## 4. WhatsApp Triggers (examples)

- Check-in → *"🥊 Marcus, you're checked in at 6:42 PM."*
- Check-out → *"Session logged — 47 min with T. Reyes."*
- Balance > 0 and unchanged for 3+ days → *"Reminder: you have a $35 balance on your account."*
- `nextFeeDate` within 5 days → *"Your membership renews Sept 1 — $70 due."*
- New group session added / reminder 24hrs before → *"Cardio Sparring Circuit tomorrow, 6 PM with D. Okafor."*

Each of these needs a **pre-approved WhatsApp message template** in Meta Business Manager before it can be sent outside a live customer conversation — that approval step is required by WhatsApp, not optional.

## 5. Build Phases

1. **PDF → Sheet (one-way, daily):** get the extraction job reliably turning your PDFs into clean Sheet rows. No WhatsApp yet — just validate the data is right.
2. **App reads from Sheet:** point the prototype's data layer at the live Sheet via the Sheets API instead of in-memory seed data.
3. **Change detection:** add the diffing logic so the system knows what actually changed each day.
4. **WhatsApp Cloud API:** register a Meta Business account, get message templates approved, wire up sending.
5. **Two-way sync (optional, later):** check-ins/edits made in the app write back to the Sheet immediately rather than waiting for the daily PDF pull.

## 6. Things Worth Knowing Before Building

- **WhatsApp Business API isn't free or instant** — it requires a Meta Business verification and template approval process that can take days.
- **Scanned PDFs need OCR**, not just text extraction — worth checking now which kind your files are, since it changes the tooling.
- **The daily PDF pull is inherently a step behind reality** — if the PDFs are your only source, same-day changes (like a walk-in payment) won't reach WhatsApp until the next day's run, unless you also do the two-way sync in Phase 5.
- **This is a real engineering build**, not something a chat-based prototype can run continuously — it needs a small persistent server or scheduled cloud job somewhere.

---

*Once you upload a sample PDF, the actual per-row extraction logic can be built and tested against your real file format.*
