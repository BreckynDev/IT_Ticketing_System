import { useState, useEffect, useMemo } from 'react'
import { getTickets, updateTicket as updateTicketApi } from '../api/tickets'

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent']
const STATUS_OPTIONS = ['Open', 'Closed']

const TRACKED_FIELDS = ['status', 'priority', 'notes']

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

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets()
        setTicketData(data)
        setOriginalData(Object.fromEntries(data.map((t) => [t.id || t._id, t])))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [])

  function updateTicket(id, changes) {
    setTicketData((prev) =>
      prev.map((ticket) =>
        (ticket.id || ticket._id) === id ? { ...ticket, ...changes } : ticket
      )
    )
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

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
            notes: ticket.notes,
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
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
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
    <div className="p-8 pb-20 max-w-7xl mx-auto min-h-screen bg-gray-50 font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          className="border border-gray-200 rounded-md text-xs px-2 py-1.5 bg-white"
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="border border-gray-200 rounded-md text-xs px-2 py-1.5 bg-white"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Email"
          value={filters.email}
          onChange={(e) => handleFilterChange('email', e.target.value)}
          className="border border-gray-200 rounded-md text-xs px-2 py-1.5 bg-white"
        />
        <input
          type="text"
          placeholder="Room"
          value={filters.room}
          onChange={(e) => handleFilterChange('room', e.target.value)}
          className="border border-gray-200 rounded-md text-xs px-2 py-1.5 bg-white"
        />
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="border border-gray-200 rounded-md text-xs px-2 py-1.5 bg-white"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="border border-gray-200 rounded-md text-xs px-2 py-1.5 bg-white"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Created"
          value={filters.created_at}
          onChange={(e) => handleFilterChange('created_at', e.target.value)}
          className="border border-gray-200 rounded-md text-xs px-2 py-1.5 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Room</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTickets.map((ticket) => {
              const id = ticket.id || ticket._id
              return (
                <tr
                  key={id}
                  onClick={() => setSelectedId(id)}
                  className="hover:bg-gray-50 align-top cursor-pointer"
                >
                  <td className="px-3 py-1.5 font-semibold text-gray-900">{ticket.name}</td>
                  <td className="px-3 py-1.5">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-gray-600">{ticket.email}</td>
                  <td className="px-3 py-1.5 text-gray-600">{ticket.room}</td>
                  <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={ticket.priority || ''}
                      onChange={(e) => updateTicket(id, { priority: e.target.value })}
                      className="border border-gray-200 rounded-md text-[11px] px-1.5 py-0.5 bg-white"
                    >
                      <option value="" disabled>Select</option>
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={ticket.status || 'Open'}
                      onChange={(e) => updateTicket(id, { status: e.target.value })}
                      className="border border-gray-200 rounded-md text-[11px] px-1.5 py-0.5 bg-white"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5 text-gray-500 whitespace-nowrap">
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
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 pr-6">
              {selectedTicket.name}
            </h3>

            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Notes
              </p>
              <textarea
                value={selectedTicket.notes || ''}
                onChange={(e) =>
                  updateTicket(selectedTicket.id || selectedTicket._id, { notes: e.target.value })
                }
                rows={4}
                className="w-full border border-gray-200 rounded-md text-sm p-2"
                placeholder="Add notes..."
              />
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto px-8 py-3 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || pendingIds.size === 0}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : `Save Changes${pendingIds.size > 0 ? ` (${pendingIds.size})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Admin