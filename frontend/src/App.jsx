import { useState } from 'react'
import { createTicket } from './api/tickets'
import { motion } from "framer-motion"


function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  // Page Status
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
      setName('')
      setEmail('')
      setRoom('')
      setCategory('')
      setDescription('')
  }
  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await createTicket ({ name, email, room, category, description})
      setSubmitted(true)
      resetForm()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  } 

  // Success Pop-Up
if (submitted) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm"
      >
        <div className="text-5xl mb-4">
          ✓
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Ticket Submitted!
        </h2>

        <p className="text-gray-500 mt-2">
          Your IT support request has been received.
        </p>

        <button
          onClick={() => {
            resetForm()
            setSubmitted(false)
          }}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition"
        >
          Create Another Ticket
        </button>

      </motion.div>
    </div>
  )
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form 
      className="flex flex-col w-full p-8 gap-4 max-w-md rounded-2xl shadow-2xl border border-gray-200 bg-[#F4F6F8]" 
      onSubmit={handleSubmit}>

        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Ticket Form
          </h2>
          <p className="text-gray-500 mt-1">
            Submit an IT support request.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Enter Name: </label>
          <input
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-lg transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Enter Email: </label>
          <input
            type="email"
            placeholder="john.smith@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-lg transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Enter Room: </label>
          <input
            type="text"
            placeholder="201 or Kitten"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-lg transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Select Category: </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-lg transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option></option>
            <option>Hardware</option>
            <option>Software</option>
            <option>Network</option>
            <option>Account/Login</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Enter description: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="p-2 w-full border border-gray-300 rounded-lg transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button 
          type="submit"
          disabled={(!name || !email || !room || !category || !description) || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
        >
        {isSubmitting ? (
          <>
            <motion.div
              className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
            />
            Submitting...
          </>
        ) : (
          "Submit Ticket"
        )}
        </button>
        
        
      </form>
    </div>
  )
}

export default App