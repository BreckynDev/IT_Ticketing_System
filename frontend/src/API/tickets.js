const API_URL = import.meta.env.VITE_API_URL

export async function getTickets() {
    const res = await fetch(`${API_URL}/tickets`)
    const result = await res.json()
    if (!result.success) {
        throw new Error(result.message || "Failed to fetch tickets")
    }
    console.log(result)
    return result.data
}   

export async function createTicket(ticketData) {
    const res = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
    })
    const result = await res.json()
    if (!result.success) {
        throw new Error(result.message || "Failed to create ticket")
    }
    console.log(result)
    return result.data
}

export async function updateTicket(id, ticketData) {
    const res = await fetch(`${API_URL}/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
    })
    const result = await res.json()
    if (!result.success) {
        throw new Error(result.message || "Failed to update ticket")
    }
    return result.data
}
