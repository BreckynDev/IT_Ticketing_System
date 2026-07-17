## Flow

User fills form → Express API validates & saves → Postgres (source of truth)
↓
Auto-synced to Google Sheets
↓
You review, assign priority, work the ticket
↓
You check "Resolved" in Sheets → Apps Script fires
↓
Auto-email sent to the user who submitted it

## Form Fields (submitted by user)

- Name
- Email
- location/room
- Issue category (dropdown: Hardware, Software, Network, Account/Login, Other)
- Description (free text)
- Device/asset info (optional — e.g., "Room 4 desktop")

## Fields Managed After Intake (not on the form)

- Priority
- Status (open / in_progress / resolved)
- Internal notes (troubleshooting notes, not visible to submitter)
- Resolved timestamp (auto-set when checking the box)

## Postgres Schema

tickets
├── id
├── name
├── email
├── department
├── category (VARCHAR — validated in Express, not a DB enum)
├── description
├── device_info (nullable/optional)
├── priority (nullable until set)
├── status (default: 'open')
├── internal_notes
├── created_at
└── resolved_at (nullable, set on completion)
