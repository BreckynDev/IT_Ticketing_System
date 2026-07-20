import { useState } from 'react'
import { createTicket } from './api/tickets'


function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState('')
  const [category, setCategory] = useState('Hardware')
  const [description, setDescription] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await createTicket ({ name, email, room, category, description})
      setName('')
      setEmail('')
      setRoom('')
      setCategory('Hardware')
      setDescription('')
    } catch (error) {
      console.error(error)
    }
  } 

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Enter email: </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Enter Room: </label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <label>Category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Hardware</option>
          <option>Software</option>
          <option>Network</option>
          <option>Account/Login</option>
          <option>Other</option>
        </select>

        <label>Enter description: </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  )
}

export default App