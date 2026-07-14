import { Router } from "express";
import { sql } from "../db.js"

const router = Router();

// Create Ticket
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

// Get all Tickets
router.get('/', async (req, res) => {

        const tickets = await sql `
        SELECT * FROM tickets`

        res.status(200).json({ success: true, data: tickets})

    } catch (error) {
        console.log("Error in retrieving all tickets")
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get one Ticket
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const ticket = await sql `
        SELECT * FROM tickets WHERE id=${id}`

        if (ticket.length === 0) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({ success: true, data: ticket[0]})

    } catch (error) {
        console.log("Error in retrieving ticket ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Update a ticket
router.patch('/:id', (req, res) => {
    res.send("Ticket Updated")
})

// remove a ticket
router.delete('/:id', (req, res) => {
    res.send("Ticket Remover")
})

export default router;