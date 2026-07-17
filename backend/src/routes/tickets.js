import { Router } from "express";
import { sql } from "../db.js"

const router = Router();

// Create Ticket
router.post('/', async (req, res) => {
  const { name, email, room, category, description, device_info } = req.body;

  if (!name || !email || !room || !category || !description) {
    return res.status(400).json({ success: false, message: "Missing required fields" })
  }

  try {
    const ticket = await sql`
        INSERT INTO tickets (name, email, room, category, description, device_info)
        VALUES(${name}, ${email}, ${room}, ${category}, ${description}, ${device_info})
        RETURNING *
    `
    res.status(201).json({ success: true, data: ticket[0]})

    } catch (error) {
        console.error("Error creating ticket: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

});

// Get all Tickets
router.get('/', async (req, res) => {

    try {
        const tickets = await sql `
        SELECT * FROM tickets`

        res.status(200).json({ success: true, data: tickets})

    } catch (error) {
        console.log("Error in retrieving all tickets: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get one Ticket
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const ticket = await sql `
        SELECT * FROM tickets WHERE id = ${id}`

        if (ticket.length === 0) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({ success: true, data: ticket[0]})

    } catch (error) {
        console.log("Error retrieving ticket: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Update a ticket
router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const { status, priority, internal_notes} = req.body;
    try {
        const ticket = await sql `
        SELECT id FROM tickets WHERE id = ${id}`

        if (ticket.length === 0) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        const update = await sql`
        UPDATE tickets
        SET 
            status = COALESCE(${status}, status),
            priority = COALESCE(${priority}, priority),
            internal_notes = COALESCE(${internal_notes}, internal_notes)
        WHERE id = ${id}
        RETURNING *`

        res.status(200).json({ success: true, data: update[0] });

    } catch (error) {
        console.error("Error in updating ticket: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

})

// remove a ticket
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const ticket = await sql`
        SELECT id FROM tickets WHERE id = ${id}`

        if (ticket.length === 0) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        await sql`DELETE FROM tickets WHERE id = ${id} RETURNING *`

        res.status(200).json({ success: true, message: "Ticket Deleted"});
    } catch (error) {
        console.error("Error deleting ticket: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

})

export default router;