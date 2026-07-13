## Setup Commands

npm init -y — initialize project, creates package.json
npm install express — web framework
npm install dotenv — loads .env into process.env
npm install @neondatabase/serverless — Neon Postgres client
npm install -D nodemon — dev dependency, auto-restarts server on save

## Run Scripts (from package.json)

npm run dev — starts server with nodemon (auto-restart, use while developing)
npm start — starts server with plain node (no auto-restart, use in production)

## Concepts

Node.js — runtime environment; executes JavaScript outside a browser
Express.js — web framework; runs on top of Node to handle HTTP routing/requests
