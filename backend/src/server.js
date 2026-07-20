import express from "express"
import cors from "cors"
import { initDB } from "./db.js"
import ticket_routes from "./routes/tickets.js";
import 'dotenv/config'


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());    
app.use('/tickets', ticket_routes);

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