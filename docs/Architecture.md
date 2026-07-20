# Architecture

React → API Layer → Express Router → Database → Express Response → React

## Directory Trees

```
backend/
├── src/
│ ├── routes/
│ │ └── tickets.js      — Defines ticket CRUD API endpoints (create, read, update, delete).
│ ├── server.js         — Initializes Express, loads routes, runs database setup, and starts the server.
│ ├── db.js             — Handles Neon database connection. Exports sql and initDB() for creating tables.
│ └── mail.js           - Handles email notifications and contents
├── .env                — Stores backend environment variables.
└── package.json        — Backend dependencies and scripts.

frontend/
├── src/
│ ├── api/
│ │ └── tickets.js      — Handles API requests between the React app and backend ticket routes.
│ ├── App.jsx           — Main React component containing the ticket form and UI logic.
│ ├── index.css         — Tailwind CSS configuration and global styles.
│ └── main.jsx          — React entry point. Mounts components into the browser DOM.
├── .env                — Stores frontend environment variables.
├── eslint.config.js    — ESLint configuration.
├── index.html          — Main HTML template loaded by Vite.
├── package.json        — Frontend dependencies and scripts.
└── vite.config.js      — Vite development and build configuration.
```

## Backend Request Flow

1.  server.js boots Express and attaches routes (e.g. /tickets → tickets.js)
    Note: This wiring happens before the server listens for HTTP requests

2.  When an HTTP request is received, Express matches the request path and method to the appropriate route handler.

3.  That handler (router) does the actual work, performing actions like: validate input, query Postgres via
    sql, and send a response back.

## Frontend Request Flow

1. The user interacts with the React interface by completing the ticket form and submitting a request.

2. `App.jsx` handles the submit event through `handleSubmit()` and prevents the browser from refreshing.

3. Form values are stored in React state (`name`, `email`, `room`, `category`, `description`) and passed to the API layer.

4. The API module (`api/tickets.js`) creates the HTTP request and sends the ticket data as JSON to the backend.

5. The backend processes the request, interacts with the database, and returns a response.

6. `App.jsx` receives the response and updates React state:
   - Clears the form
   - Displays success confirmation
   - Handles errors

7. React re-renders the interface based on the updated state.
