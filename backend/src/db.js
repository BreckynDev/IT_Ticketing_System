import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv"

dotenv.config()

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      room VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      priority VARCHAR(255),
      status VARCHAR(255) DEFAULT 'open',
      internal_notes VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP
    )`;
    console.log("Database initialized");

    } catch (error) {
        console.error("Failed to initialize database:", error)
        console.log("Shutting Down")
        process.exit(1)
    }
}
