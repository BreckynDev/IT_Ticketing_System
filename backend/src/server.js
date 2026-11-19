import 'dotenv/config';
import express from "express";
import cors from "cors";
import { initDB } from "./db.js";
import ticket_routes from "./routes/tickets.js";
import auth_routes from "./routes/auth.js";


const app = express();
const PORT = process.env.PORT || 5000; 

app.set("trust proxy", 1)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use('/tickets', ticket_routes);
app.use('/auth', auth_routes);

// Routes
app.get('/', (req, res) => {
  res.send("Backend Working");
});

async function startServer() {
    await initDB();
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });
}

startServer()