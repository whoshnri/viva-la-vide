'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    createDepartmentAction,
    deleteDepartmentAction,
    createLevelAction,
    deleteLevelAction,
    createStudentAction,
    deleteStudentAction,
    uploadStudentsAction
} from '@/lib/actions'

interface Student {
    id: string
    matricNo: string
    name: string
}

interface Level {
    id: string
    name: string
    departmentId: string
    students: Student[]
    _count: { students: number }
}

interface Department {
    id: string
    name: string
    matricFormat: string
    levels: Level[]
}

export default function StudentsClient({ departments }: { departments: Department[] }) {
    const router = useRouter()
    const [showDeptModal, setShowDeptModal] = useState(false)
    const [showLevelModal, setShowLevelModal] = useState<string | null>(null)
    const [showStudentModal, setShowStudentModal] = useState<string | null>(null)
    const [showUploadModal, setShowUploadModal] = useState<string | null>(null)
    const [expandedDept, setExpandedDept] = useState<string | null>(null)
    const [expandedLevel, setExpandedLevel] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form states
    const [deptName, setDeptName] = useState('')
    const [deptMatricFormat, setDeptMatricFormat] = useState('')
    const [levelName, setLevelName] = useState('')
    const [studentMatricNo, setStudentMatricNo] = useState('')
    const [studentName, setStudentName] = useState('')
    const [csvFile, setCsvFile] = useState<File | null>(null)

    const resetForms = () => {
        setDeptName('')
        setDeptMatricFormat('')
        setLevelName('')
        setStudentMatricNo('')
        setStudentName('')
        setCsvFile(null)
        setError(null)
    }

    const handleCreateDepartment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const result = await createDepartmentAction({ name: deptName, matricFormat: deptMatricFormat })
        setLoading(false)
        if ('error' in result) {
            setError(result.error)
        } else {
            resetForms()
            setShowDeptModal(false)
            router.refresh()
        }
    }

    const handleDeleteDepartment = async (id: string) => {
        if (!confirm('Delete this department and all its data?')) return
        setLoading(true)
        await deleteDepartmentAction(id)
        setLoading(false)
        router.refresh()
    }

    const handleCreateLevel = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!showLevelModal) return
        setLoading(true)
        setError(null)
        const result = await createLevelAction({ name: levelName, departmentId: showLevelModal })
        setLoading(false)
        if ('error' in result) {
            setError(result.error)
        } else {
            resetForms()
            setShowLevelModal(null)
            router.refresh()
        }
    }

    const handleDeleteLevel = async (id: string) => {
        if (!confirm('Delete this level and all students?')) return
        setLoading(true)
        await deleteLevelAction(id)
        setLoading(false)
        router.refresh()
    }

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!showStudentModal) return
        setLoading(true)
        setError(null)
        const result = await createStudentAction({
            matricNo: studentMatricNo,
            name: studentName,
            levelId: showStudentModal
        })
        setLoading(false)
        if ('error' in result) {
            setError(result.error)
        } else {
            resetForms()
            setShowStudentModal(null)
            router.refresh()
        }
    }

    const handleDeleteStudent = async (id: string) => {
        if (!confirm('Delete this student?')) return
        setLoading(true)
        await deleteStudentAction(id)
        setLoading(false)
        router.refresh()
    }

    const handleUploadStudents = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!showUploadModal || !csvFile) return
        setLoading(true)
        setError(null)

        const csvContent = await csvFile.text()
        const result = await uploadStudentsAction({ levelId: showUploadModal, csvContent })
        setLoading(false)
        if ('error' in result) {
            setError(result.error)
        } else {
            resetForms()
            setShowUploadModal(null)
            router.refresh()
        }
    }

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <h1 className="page-title">Students</h1>
                <button className="btn btn-primary" onClick={() => setShowDeptModal(true)}>
                    Add Department
                </button>
            </div>

            {departments.length === 0 ? (
                <div className="empty-state">
                    <p className="text-lg font-bold mb-2">No departments yet</p>
                    <p className="text-gray-600">Add a department to start managing students.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {departments.map((dept) => (
                        <div key={dept.id} className="card">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                            >
                                <div>
                                    <h3 className="text-lg font-bold">{dept.name}</h3>
                                    <p className="text-sm text-gray-600">Format: {dept.matricFormat}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="badge">
                                        {dept.levels.reduce((sum, l) => sum + l._count.students, 0)} students
                                    </span>
                                    <span className="text-2xl">{expandedDept === dept.id ? '−' : '+'}</span>
                                </div>
                            </div>

                            {expandedDept === dept.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold">Levels</h4>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn"
                                                onClick={(e) => { e.stopPropagation(); setShowLevelModal(dept.id) }}
                                            >
                                                Add Level
                                            </button>
                                            <button
                                                className="btn btn-destructive"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteDepartment(dept.id) }}
                                                disabled={loading}
                                            >
                                                Delete Dept
                                            </button>
                                        </div>
                                    </div>

                                    {dept.levels.length === 0 ? (
                                        <p className="text-gray-600">No levels yet</p>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {dept.levels.map((level) => (
                                                <div key={level.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                                                    <div
                                                        className="flex justify-between items-center cursor-pointer"
                                                        onClick={() => setExpandedLevel(expandedLevel === level.id ? null : level.id)}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-bold">{level.name}</span>
                                                            <span className="badge">{level._count.students} students</span>
                                                        </div>
                                                        <span>{expandedLevel === level.id ? '−' : '+'}</span>
                                                    </div>

                                                    {expandedLevel === level.id && (
                                                        <div className="mt-4 pt-4 border-t border-gray-300">
                                                            <div className="flex gap-2 mb-4">
                                                                <button
                                                                    className="btn"
                                                                    onClick={(e) => { e.stopPropagation(); setShowStudentModal(level.id) }}
                                                                >
                                                                    Add Student
                                                                </button>
                                                                <button
                                                                    className="btn"
                                                                    onClick={(e) => { e.stopPropagation(); setShowUploadModal(level.id) }}
                                                                >
                                                                    Upload CSV
                                                                </button>
                                                                <button
                                                                    className="btn btn-destructive"
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteLevel(level.id) }}
                                                                    disabled={loading}
                                                                >
                                                                    Delete Level
                                                                </button>
                                                            </div>

                                                            {level.students.length === 0 ? (
                                                                <p className="text-gray-600">No students</p>
                                                            ) : (
                                                                <table className="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Matric No</th>
                                                                            <th>Full Matric</th>
                                                                            <th>Name</th>
                                                                            <th>Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {level.students.map((student) => (
                                                                            <tr key={student.id}>
                                                                                <td>{student.matricNo}</td>
                                                                                <td className="font-mono">{dept.matricFormat}{student.matricNo}</td>
                                                                                <td>{student.name}</td>
                                                                                <td>
                                                                                    <button
                                                                                        className="btn btn-destructive"
                                                                                        onClick={() => handleDeleteStudent(student.id)}
                                                                                        disabled={loading}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Department Modal */}
            {showDeptModal && (
                <div className="modal-overlay" onClick={() => { setShowDeptModal(false); resetForms() }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">Add Department</h2>
                        <form onSubmit={handleCreateDepartment}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Department Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={deptName}
                                    onChange={(e) => setDeptName(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="matricFormat">Matric Format</label>
                                <input
                                    type="text"
                                    id="matricFormat"
                                    value={deptMatricFormat}
                                    onChange={(e) => setDeptMatricFormat(e.target.value)}
                                    className="input"
                                    placeholder="e.g. F/ND/23/"
                                    required
                                />
                                <p className="text-sm text-gray-600 mt-1">This will prefix all student matric numbers</p>
                            </div>
                            {error && <p className="error-text mb-4">{error}</p>}
                            <div className="flex gap-4">
                                <button type="button" className="btn flex-1" onClick={() => { setShowDeptModal(false); resetForms() }}>Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Level Modal */}
            {showLevelModal && (
                <div className="modal-overlay" onClick={() => { setShowLevelModal(null); resetForms() }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">Add Level</h2>
                        <form onSubmit={handleCreateLevel}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="levelName">Level Name</label>
                                <input
                                    type="text"
                                    id="levelName"
                                    value={levelName}
                                    onChange={(e) => setLevelName(e.target.value)}
                                    className="input"
                                    placeholder="e.g. 100, ND1"
                                    required
                                />
                            </div>
                            {error && <p className="error-text mb-4">{error}</p>}
                            <div className="flex gap-4">
                                <button type="button" className="btn flex-1" onClick={() => { setShowLevelModal(null); resetForms() }}>Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {showStudentModal && (
                <div className="modal-overlay" onClick={() => { setShowStudentModal(null); resetForms() }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">Add Student</h2>
                        <form onSubmit={handleCreateStudent}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="matricNo">Matric Number</label>
                                <input
                                    type="text"
                                    id="matricNo"
                                    value={studentMatricNo}
                                    onChange={(e) => setStudentMatricNo(e.target.value)}
                                    className="input"
                                    placeholder="e.g. 001"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="studentName">Full Name</label>
                                <input
                                    type="text"
                                    id="studentName"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                            {error && <p className="error-text mb-4">{error}</p>}
                            <div className="flex gap-4">
                                <button type="button" className="btn flex-1" onClick={() => { setShowStudentModal(null); resetForms() }}>Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload CSV Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => { setShowUploadModal(null); resetForms() }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">Upload Students CSV</h2>
                        <form onSubmit={handleUploadStudents}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="file">CSV File</label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                    className="input"
                                    accept=".csv"
                                    required
                                />
                                <p className="text-sm text-gray-600 mt-1">
                                    Format: matricNo, name (one per line)
                                </p>
                            </div>
                            {error && <p className="error-text mb-4">{error}</p>}
                            <div className="flex gap-4">
                                <button type="button" className="btn flex-1" onClick={() => { setShowUploadModal(null); resetForms() }}>Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
