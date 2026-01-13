'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createHallAction, updateHallAction, deleteHallAction } from '@/lib/actions'

interface Hall {
    id: string
    name: string
    code: string
    capacity: number
}

export default function HallsClient({ halls }: { halls: Hall[] }) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [editingHall, setEditingHall] = useState<Hall | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form states
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [capacity, setCapacity] = useState('')

    const resetForm = () => {
        setName('')
        setCode('')
        setCapacity('')
        setError(null)
    }

    const handleEdit = (hall: Hall) => {
        setEditingHall(hall)
        setName(hall.name)
        setCode(hall.code)
        setCapacity(String(hall.capacity))
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
        setEditingHall(null)
        resetForm()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const data = { name, code, capacity: parseInt(capacity) }

        const result = editingHall
            ? await updateHallAction(editingHall.id, data)
            : await createHallAction(data)

        setLoading(false)
        if ('error' in result) {
            setError(result.error)
        } else {
            handleClose()
            router.refresh()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this hall?')) return
        setLoading(true)
        await deleteHallAction(id)
        setLoading(false)
        router.refresh()
    }

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <h1 className="page-title">Halls</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Add Hall
                </button>
            </div>

            {halls.length === 0 ? (
                <div className="empty-state">
                    <p className="text-lg font-bold mb-2">No halls yet</p>
                    <p className="text-gray-600">Add your first examination hall to get started.</p>
                </div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Capacity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {halls.map((hall) => (
                            <tr key={hall.id}>
                                <td className="font-bold">{hall.name}</td>
                                <td>{hall.code}</td>
                                <td>{hall.capacity}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="btn" onClick={() => handleEdit(hall)}>
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-destructive"
                                            onClick={() => handleDelete(hall.id)}
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">
                            {editingHall ? 'Edit Hall' : 'Add Hall'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Hall Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="code">Code</label>
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="input"
                                    placeholder="e.g. HALL-A"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="capacity">Capacity</label>
                                <input
                                    type="number"
                                    id="capacity"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="input"
                                    min={1}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="error-text mb-4">{error}</p>
                            )}

                            <div className="flex gap-4">
                                <button type="button" className="btn flex-1" onClick={handleClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
