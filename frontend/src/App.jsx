import { useState } from 'react'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState('')
  const [category, setCategory] = useState('Hardware')
  const [description, setDescription] = useState('')
  const [deviceInfo, setDeviceInfo] = useState('')

  return (
    <div>
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
        value={department}
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

      <label>Enter device info: </label>
      <input
        type="text"
        value={deviceInfo}
        onChange={(e) => setDeviceInfo(e.target.value)}
      />
    </div>
  )
}

export default App