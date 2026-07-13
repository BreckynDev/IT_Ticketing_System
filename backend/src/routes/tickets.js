import { Router } from "express";
import { sql } from "../db.js"

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, department, category, description, device_info } = req.body;

  if (!name || !email || !department || !category || !description) {
    return res.status(400).json({ success: false, message: "Missing required fields" })
  }

  try {
    const ticket = await sql`
        INSERT INTO tickets (name, email, department, category, description, device_info)
        VALUES(${name}, ${email}, ${department}, ${category}, ${description}, ${device_info})
        RETURNING *
    `
    res.status(201).json({ success: true, data: ticket})

    } catch (error) {
        console.error("Error creating ticket: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

});

router.get('/:id', (req, res) => {
    res.send("Ticket retrieved")
})

export default router;