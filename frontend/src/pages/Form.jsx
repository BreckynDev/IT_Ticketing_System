import { useState } from 'react'
import { createTicket } from '../api/tickets'
import { motion } from "framer-motion"

const fieldClass =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition hover:border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

function Form() {
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
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-zinc-200"
      >
        <div className="mb-3 text-4xl text-emerald-600">
          ✓
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Ticket submitted
        </h2>

        <p className="mt-1.5 text-sm text-zinc-500">
          Your IT support request has been received.
        </p>

        <button
          onClick={() => {
            resetForm()
            setSubmitted(false)
          }}
          className="mt-6 w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
        >
          Create another ticket
        </button>

      </motion.div>
    </div>
  )
}

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-10">
      <form 
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-zinc-200" 
      onSubmit={handleSubmit}>

        <div className="mb-1">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Ticket form
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Submit an IT support request.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">Name</label>
          <input
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">Email</label>
          <input
            type="email"
            placeholder="john.smith@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">Room</label>
            <input
              type="text"
              placeholder="123"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className={fieldClass}
            >
              <option></option>
              <option>Hardware</option>
              <option>Software</option>
              <option>Network</option>
              <option>Account/Login</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${fieldClass} resize-none`}
          />
        </div>
        <button 
          type="submit"
          disabled={(!name || !email || !room || !category || !description) || isSubmitting}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
        >
        {isSubmitting ? (
          <>
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
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
          "Submit ticket"
        )}
        </button>
      </form>

      <a
        href="/admin"
        className="mt-4 text-xs text-zinc-400 transition hover:text-zinc-600"
      >
        Admin portal
      </a>
    </div>
  )
}

export default Form