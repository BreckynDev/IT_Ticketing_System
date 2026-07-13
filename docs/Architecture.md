## Request Flow

1.  server.js boots Express and attaches routes (e.g. /tickets → tickets.js)
    Note: This wiring happens before the server listens for HTTP requests

2.  Once a request is heard, Express matches and directs the request to the matching handler

3.  That handler (router) does the actual work, performing actions like: validate input, query Postgres via
    sql, and send a response back.

## Directory Trees

backend/
├── src/
│ ├── server.js — Boots Express, attaches routes, calls initDB() before listening.
│ ├── db.js — Neon connection. Exports `sql` and `initDB()` (creates tickets table).
│ └── routes/
│ └── tickets.js — POST / creates a ticket. GET /:id is a stub, not built yet.
├── .env — Environment variables (DATABASE_URL, PORT). Not committed.
└── package.json
