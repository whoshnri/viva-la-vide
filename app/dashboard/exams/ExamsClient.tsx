'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createExamAction, deleteExamAction } from '@/lib/actions'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

interface Hall {
    id: string
    name: string
    code: string
    capacity: number
}

interface Level {
    id: string
    name: string
    department: { name: string }
    _count: { students: number }
}

interface Exam {
    id: string
    title: string
    date: string
    examHalls: { hall: Hall }[]
    examLevels: { level: Level }[]
    _count: { seatAssignments: number }
}

export default function ExamsClient({
    exams,
    halls,
    levels
}: {
    exams: Exam[]
    halls: Hall[]
    levels: Level[]
}) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [selectedHalls, setSelectedHalls] = useState<string[]>([])
    const [selectedLevels, setSelectedLevels] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null)

    // Form states
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')

    const resetForm = () => {
        setTitle('')
        setDate('')
        setSelectedHalls([])
        setSelectedLevels([])
        setError(null)
    }

    const toggleHall = (id: string) => {
        setSelectedHalls(prev =>
            prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
        )
    }

    const toggleLevel = (id: string) => {
        setSelectedLevels(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        )
    }

    // Calculate capacity check
    const totalCapacity = halls
        .filter(h => selectedHalls.includes(h.id))
        .reduce((sum, h) => sum + h.capacity, 0)

    const totalStudents = levels
        .filter(l => selectedLevels.includes(l.id))
        .reduce((sum, l) => sum + l._count.students, 0)

    const capacityOk = totalCapacity >= totalStudents

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await createExamAction({
            title,
            date,
            hallIds: selectedHalls,
            levelIds: selectedLevels
        })

        setLoading(false)
        if ('error' in result) {
            setError(result.error)
        } else {
            resetForm()
            setShowModal(false)
            router.refresh()
        }
    }

    const handleDelete = async (id: string, name: string) => {
        setDeleteTarget({ id, name })
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return
        setLoading(true)
        try {
            await deleteExamAction(deleteTarget.id)
            router.refresh()
        } catch (err) {
            setError('Failed to delete exam.')
        } finally {
            setLoading(false)
            setDeleteTarget(null)
        }
    }

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <h1 className="page-title">Exams</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Create Exam
                </button>
            </div>

            {exams.length === 0 ? (
                <div className="empty-state">
                    <p className="text-lg font-bold mb-2">No exams yet</p>
                    <p className="text-gray-600">Create your first examination event to start allocating.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {exams.map((exam) => (
                        <div key={exam.id} className="card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{exam.title}</h3>
                                    <p className="text-gray-600">
                                        {new Date(exam.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/exams/${exam.id}`} className="btn btn-primary">
                                        View Details
                                    </Link>
                                    <button
                                        className="btn btn-destructive"
                                        onClick={() => handleDelete(exam.id, exam.title)}
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-4">
                                <div>
                                    <span className="font-bold">Halls: </span>
                                    {exam.examHalls.map(eh => eh.hall.name).join(', ')}
                                </div>
                                <div>
                                    <span className="font-bold">Levels: </span>
                                    {exam.examLevels.map(el => `${el.level.department.name} ${el.level.name}`).join(', ')}
                                </div>
                                <div>
                                    <span className="font-bold">Allocated: </span>
                                    <span className={exam._count.seatAssignments > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {exam._count.seatAssignments > 0 ? `${exam._count.seatAssignments} seats` : 'Not allocated'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Exam Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm() }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <h2 className="text-xl font-bold mb-6">Create Exam</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Exam Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Halls</label>
                                <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50/50">
                                    {halls.length === 0 ? (
                                        <p className="text-gray-600">No halls available</p>
                                    ) : (
                                        halls.map((hall) => (
                                            <label key={hall.id} className="flex items-center gap-2 cursor-pointer py-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedHalls.includes(hall.id)}
                                                    onChange={() => toggleHall(hall.id)}
                                                    className="w-5 h-5"
                                                />
                                                <span className="font-bold">{hall.name}</span>
                                                <span className="text-gray-600">({hall.capacity} seats)</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <p className="text-sm mt-1">Selected capacity: <strong>{totalCapacity}</strong></p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Participating Levels</label>
                                <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50/50">
                                    {levels.length === 0 ? (
                                        <p className="text-gray-600">No levels available</p>
                                    ) : (
                                        levels.map((level) => (
                                            <label key={level.id} className="flex items-center gap-2 cursor-pointer py-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLevels.includes(level.id)}
                                                    onChange={() => toggleLevel(level.id)}
                                                    className="w-5 h-5"
                                                />
                                                <span className="font-bold">{level.department.name} - {level.name}</span>
                                                <span className="text-gray-600">({level._count.students} students)</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <p className="text-sm mt-1">Selected students: <strong>{totalStudents}</strong></p>
                            </div>

                            {/* Capacity Guardrail */}
                            {selectedHalls.length > 0 && selectedLevels.length > 0 && (
                                <div className={`p-4 mb-6 border rounded-lg ${capacityOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                    {capacityOk ? (
                                        <p className="font-bold text-green-800">
                                            ✓ Capacity OK: {totalCapacity} seats for {totalStudents} students
                                        </p>
                                    ) : (
                                        <p className="font-bold text-red-800">
                                            ✗ Insufficient capacity: {totalCapacity} seats for {totalStudents} students
                                        </p>
                                    )}
                                </div>
                            )}

                            {error && <p className="error-text mb-4">{error}</p>}

                            <div className="flex gap-4">
                                <button type="button" className="btn flex-1" onClick={() => { setShowModal(false); resetForm() }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                    disabled={loading || !capacityOk || selectedHalls.length === 0 || selectedLevels.length === 0}
                                >
                                    {loading ? 'Creating...' : 'Create Exam'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Unified Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                loading={loading}
                title="Delete Exam"
                message={`Are you sure you want to delete the exam "${deleteTarget?.name}"? This action cannot be undone and will remove all associated data.`}
            />
        </div>
    )
}
