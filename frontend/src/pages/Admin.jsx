import { useState, useEffect, useMemo } from 'react'
import { getTickets, updateTicket as updateTicketApi, deleteTicket, loginAdmin, getToken } from '../api/tickets'

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent']
const STATUS_OPTIONS = ['Open', 'Closed']

const TRACKED_FIELDS = ['status', 'priority', 'internal_notes']

// Style helpers (classes only, no logic)
const PRIORITY_STYLES = {
  Low: 'text-zinc-600',
  Medium: 'text-amber-700',
  High: 'text-orange-700',
  Urgent: 'text-red-700 font-semibold',
}
const STATUS_STYLES = {
  Open: 'text-emerald-700',
  Closed: 'text-zinc-500',
}

const filterClass =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-sm outline-none transition hover:border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

const rowSelectClass =
  'rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium outline-none transition hover:border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString([], {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function normalize(value) {
  return value === null || value === undefined ? '' : value
}

function hasChanges(ticket, original) {
  if (!original) return false
  return TRACKED_FIELDS.some((field) => normalize(ticket[field]) !== normalize(original[field]))
}

function Admin() {
  const [ticketData, setTicketData] = useState([])
  const [originalData, setOriginalData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    email: '',
    room: '',
    priority: '',
    status: '',
    created_at: '',
  })
  const [authed, setAuthed] = useState(() => Boolean(getToken()))
  const [passkey, setPasskey] = useState('')
  const [authError, setAuthError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    if (!authed) {
      setLoading(false)
      return
    }

    async function loadTickets() {
      setLoading(true)
      try {
        const data = await getTickets()
        setTicketData(data)
        setOriginalData(Object.fromEntries(data.map((t) => [t.id || t._id, t])))
      } catch (error) {
        if (error.message === 'UNAUTHORIZED') {
          setAuthed(false)
        } else {
          console.error(error)
        }
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [authed])

  const pendingIds = useMemo(() => {
    const ids = new Set()
    for (const ticket of ticketData) {
      const id = ticket.id || ticket._id
      if (hasChanges(ticket, originalData[id])) ids.add(id)
    }
    return ids
  }, [ticketData, originalData])

  const categoryOptions = useMemo(
    () => [...new Set(ticketData.map((t) => t.category).filter(Boolean))],
    [ticketData]
  )

  async function handlePasskeySubmit(e) {
    e.preventDefault()
    setAuthError('')
    setLoggingIn(true)
    try {
      await loginAdmin(passkey)
      setPasskey('')
      setAuthed(true)
    } catch (error) {
      setAuthError(error.message || 'Invalid passkey')
    } finally {
      setLoggingIn(false)
    }
  }

  if (!authed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50 p-4">
        <form
          onSubmit={handlePasskeySubmit}
          className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-zinc-200"
        >
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Admin access</h2>
            <p className="mt-1 text-sm text-zinc-500">Enter the admin passkey to continue.</p>
          </div>

          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Passkey"
            autoFocus
            className={filterClass}
          />

          {authError && (
            <p className="text-sm font-medium text-red-600">{authError}</p>
          )}

          <button
            type="submit"
            disabled={!passkey || loggingIn}
            className="rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            {loggingIn ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </div>
    )
  }

  function updateTicket(id, changes) {
    setTicketData((prev) =>
      prev.map((ticket) =>
        (ticket.id || ticket._id) === id ? { ...ticket, ...changes } : ticket
      )
    )
  }

  async function handleDelete(id) {
    try {
      await deleteTicket(id)
      setTicketData((prev) =>
        prev.filter((ticket) => (ticket.id || ticket._id) !== id)
      )
      if (selectedId === id) {
        setSelectedId(null)
      }
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        setAuthed(false)
      } else {
        console.error(error)
      }
    }
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const pendingTickets = ticketData.filter((t) => pendingIds.has(t.id || t._id))

      await Promise.all(
        pendingTickets.map((ticket) => {
          const id = ticket.id || ticket._id
          return updateTicketApi(id, {
            status: ticket.status,
            priority: ticket.priority,
            internal_notes: ticket.internal_notes,
          })
        })
      )

      setOriginalData((prev) => {
        const next = { ...prev }
        for (const ticket of pendingTickets) {
          next[ticket.id || ticket._id] = ticket
        }
        return next
      })
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        setAuthed(false)
      } else {
        console.error(error)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Loading tickets...
      </div>
    )
  }

  const sortedTickets = [...ticketData].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  const filteredTickets = sortedTickets.filter((ticket) => {
    if (filters.name && !ticket.name?.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.category && ticket.category !== filters.category) return false
    if (filters.email && !ticket.email?.toLowerCase().includes(filters.email.toLowerCase())) return false
    if (filters.room && !ticket.room?.toLowerCase().includes(filters.room.toLowerCase())) return false
    if (filters.priority && ticket.priority !== filters.priority) return false
    if (filters.status && (ticket.status || 'Open') !== filters.status) return false
    if (filters.created_at && !formatDate(ticket.created_at).toLowerCase().includes(filters.created_at.toLowerCase())) return false
    return true
  })

  const selectedTicket = sortedTickets.find(
    (ticket) => (ticket.id || ticket._id) === selectedId
  )

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl p-8 pb-24 font-sans text-zinc-900">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Admin dashboard</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {filteredTickets.length} of {ticketData.length} tickets
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
          <input
            type="text"
            placeholder="Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className={filterClass}
          />
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className={filterClass}
          >
            <option value="">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Email"
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            className={filterClass}
          />
          <input
            type="text"
            placeholder="Room"
            value={filters.room}
            onChange={(e) => handleFilterChange('room', e.target.value)}
            className={filterClass}
          />
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className={filterClass}
          >
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={filterClass}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Created"
            value={filters.created_at}
            onChange={(e) => handleFilterChange('created_at', e.target.value)}
            className={filterClass}
          />
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTickets.map((ticket) => {
                const id = ticket.id || ticket._id
                return (
                  <tr
                    key={id}
                    onClick={() => setSelectedId(id)}
                    className="cursor-pointer align-middle transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">{ticket.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{ticket.email}</td>
                    <td className="px-4 py-3 text-zinc-600">{ticket.room}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={ticket.priority || ''}
                        onChange={(e) => updateTicket(id, { priority: e.target.value })}
                        className={`${rowSelectClass} ${PRIORITY_STYLES[ticket.priority] || 'text-zinc-400'}`}
                      >
                        <option value="" disabled>Select</option>
                        {PRIORITY_OPTIONS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={ticket.status || 'Open'}
                        onChange={(e) => updateTicket(id, { status: e.target.value })}
                        className={`${rowSelectClass} ${STATUS_STYLES[ticket.status || 'Open']}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-zinc-500">
                      {formatDate(ticket.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {selectedTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Close"
              >
                ×
              </button>

              <h3 className="mb-5 pr-10 text-lg font-semibold tracking-tight text-zinc-900">
                {selectedTicket.name}
              </h3>

              <div className="mb-5">
                <p className="mb-1.5 text-xs font-medium text-zinc-500">
                  Description
                </p>
                <p className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-700">
                  {selectedTicket.description}
                </p>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-zinc-500">
                  Notes
                </p>
                <textarea
                  value={selectedTicket.internal_notes || ''}
                  onChange={(e) =>
                    updateTicket(selectedTicket.id || selectedTicket._id, { internal_notes: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-zinc-200 p-3 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition hover:border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Add notes..."
                />
              </div>
              <div>
                <div className="mt-6 flex justify-end border-t border-zinc-100 pt-4">
                  <button
                    onClick={() => handleDelete(selectedTicket.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                  >
                    Delete ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl justify-end px-8 py-3">
            <button
              onClick={handleSave}
              disabled={saving || pendingIds.size === 0}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
            >
              {saving ? 'Saving...' : `Save changes${pendingIds.size > 0 ? ` (${pendingIds.size})` : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin