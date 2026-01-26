'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { generateAllocationAction } from '@/lib/actions'

interface SeatAssignment {
    seatNumber: number
    student: {
        matricNo: string
        name: string
        realMatric : string
        level: {
            name: string
            department: { name: string; matricFormat: string }
        }
    }
    hall: { name: string; code: string }
}

interface ExamDistribution {
    allocatedCount: number
    startIndex: number
    endIndex: number
    hall: { name: string; code: string }
    level: { name: string; department: { name: string } }
}

interface ExamData {
    id: string
    title: string
    date: string
    examHalls: { hall: { id: string; name: string; code: string; capacity: number } }[]
    examLevels: { level: { id: string; name: string; department: { name: string }; _count: { students: number } } }[]
    examDistributions: ExamDistribution[]
    seatAssignments: SeatAssignment[]
}

export default function ExamDetailClient({ exam }: { exam: ExamData }) {
    const [activeTab, setActiveTab] = useState<'overview' | 'distribution' | 'seating'>('overview')
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filterHall, setFilterHall] = useState<string | null>(null)

    const handleGenerate = async () => {
        setGenerating(true)
        setError(null)
        const result = await generateAllocationAction(exam.id)
        if (result.error) {
            setError(result.error)
        }
        setGenerating(false)
    }

    const filteredSeats = filterHall
        ? exam.seatAssignments.filter(s => s.hall.code === filterHall)
        : exam.seatAssignments

    const totalStudents = exam.examLevels.reduce((sum, el) => sum + el.level._count.students, 0)
    const totalCapacity = exam.examHalls.reduce((sum, eh) => sum + eh.hall.capacity, 0)

    // Export functions
    const exportDistributionCSV = () => {
        const headers = ['Hall', 'Hall Code', 'Department', 'Level', 'Allocated Count', 'Start Index', 'End Index']
        const rows = exam.examDistributions.map(dist => [
            dist.hall.name,
            dist.hall.code,
            dist.level.department.name,
            dist.level.name,
            dist.allocatedCount,
            dist.startIndex,
            dist.endIndex
        ])

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        downloadFile(csvContent, `${exam.title}_distribution.csv`, 'text/csv')
    }

    const exportDistributionExcel = () => {
        const data = exam.examDistributions.map(dist => ({
            'Hall': dist.hall.name,
            'Hall Code': dist.hall.code,
            'Department': dist.level.department.name,
            'Level': dist.level.name,
            'Allocated Count': dist.allocatedCount,
            'Start Index': dist.startIndex,
            'End Index': dist.endIndex
        }))

        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Distribution')
        XLSX.writeFile(wb, `${exam.title}_distribution.xlsx`)
    }

    const exportSeatingCSV = () => {
        const headers = ['Seat Number', 'Hall', 'Hall Code', 'Matric No', 'Full Matric', 'Student Name', 'Department', 'Level']
        const rows = filteredSeats.map(seat => [
            seat.seatNumber,
            seat.hall.name,
            seat.hall.code,
            seat.student.matricNo,
            `${seat.student.level.department.matricFormat}${seat.student.matricNo}`,
            seat.student.name,
            seat.student.level.department.name,
            seat.student.level.name
        ])

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        const filename = filterHall
            ? `${exam.title}_seating_${filterHall}.csv`
            : `${exam.title}_seating.csv`
        downloadFile(csvContent, filename, 'text/csv')
    }

    const exportSeatingExcel = () => {
        const data = filteredSeats.map(seat => ({
            'Seat Number': seat.seatNumber,
            'Hall': seat.hall.name,
            'Hall Code': seat.hall.code,
            'Matric No': seat.student.matricNo,
            'Full Matric': `${seat.student.level.department.matricFormat}${seat.student.matricNo}`,
            'Student Name': seat.student.name,
            'Department': seat.student.level.department.name,
            'Level': seat.student.level.name
        }))

        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Seating')
        const filename = filterHall
            ? `${exam.title}_seating_${filterHall}.xlsx`
            : `${exam.title}_seating.xlsx`
        XLSX.writeFile(wb, filename)
    }

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">{exam.title}</h1>
                <p className="text-gray-600 mt-2">
                    {new Date(exam.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab ${activeTab === 'distribution' ? 'active' : ''}`}
                    onClick={() => setActiveTab('distribution')}
                >
                    Hall Distribution
                </button>
                <button
                    className={`tab ${activeTab === 'seating' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seating')}
                >
                    Seating Arrangement
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div>
                    <div className="grid grid-2 mb-6">
                        <div className="stat-card">
                            <div className="stat-value">{totalStudents}</div>
                            <div className="stat-label">Total Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{totalCapacity}</div>
                            <div className="stat-label">Total Capacity</div>
                        </div>
                    </div>

                    <div className="grid grid-2 gap-6 mb-6">
                        <div className="card">
                            <h3 className="font-bold mb-4">Selected Halls</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Hall</th>
                                        <th>Code</th>
                                        <th>Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exam.examHalls.map(eh => (
                                        <tr key={eh.hall.id}>
                                            <td>{eh.hall.name}</td>
                                            <td>{eh.hall.code}</td>
                                            <td>{eh.hall.capacity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <h3 className="font-bold mb-4">Participating Levels</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Level</th>
                                        <th>Students</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exam.examLevels.map(el => (
                                        <tr key={el.level.id}>
                                            <td>{el.level.department.name}</td>
                                            <td>{el.level.name}</td>
                                            <td>{el.level._count.students}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card w-full">
                        <h3 className="font-bold mb-4">Generate Allocation</h3>
                        <p className="text-gray-600 mb-4">
                            This will distribute students across halls proportionally and create seating arrangements.
                        </p>

                        {error && <input disabled className="error-text mb-4 truncate" value={error} />}

                        {exam.seatAssignments.length > 0 && (
                            <input disabled className="success-text mb-4 truncate" value={`✓ ${exam.seatAssignments.length} seats have been allocated`} />
                        )}

                        <button
                            className="btn btn-primary"
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            {generating ? 'Generating...' : exam.seatAssignments.length > 0 ? 'Regenerate Allocation' : 'Generate Allocation'}
                        </button>
                    </div>
                </div>
            )}

            {/* Distribution Tab */}
            {activeTab === 'distribution' && (
                <div>
                    {exam.examDistributions.length === 0 ? (
                        <div className="empty-state">
                            <p className="text-lg font-bold mb-2">No distribution yet</p>
                            <p className="text-gray-600">Generate allocation from the Overview tab first.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-gray-600">
                                    Shows how students from each level are distributed across halls (proportional spread).
                                </p>
                                <div className="flex gap-2">
                                    <button className="btn" onClick={exportDistributionCSV}>
                                        Export CSV
                                    </button>
                                    <button className="btn" onClick={exportDistributionExcel}>
                                        Export Excel
                                    </button>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Hall</th>
                                        <th>Department</th>
                                        <th>Level</th>
                                        <th>Allocated</th>
                                        <th>Range</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exam.examDistributions.map((dist, i) => (
                                        <tr key={i}>
                                            <td className="font-bold">{dist.hall.name}</td>
                                            <td>{dist.level.department.name}</td>
                                            <td>{dist.level.name}</td>
                                            <td>{dist.allocatedCount}</td>
                                            <td className="font-mono">{dist.startIndex}-{dist.endIndex}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Seating Tab */}
            {activeTab === 'seating' && (
                <div>
                    {exam.seatAssignments.length === 0 ? (
                        <div className="empty-state">
                            <p className="text-lg font-bold mb-2">No seating arrangement yet</p>
                            <p className="text-gray-600">Generate allocation from the Overview tab first.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-4 items-center">
                                    <span className="font-bold">Filter by Hall:</span>
                                    <button
                                        className={`btn ${filterHall === null ? 'btn-primary' : ''}`}
                                        onClick={() => setFilterHall(null)}
                                    >
                                        All
                                    </button>
                                    {exam.examHalls.map(eh => (
                                        <button
                                            key={eh.hall.id}
                                            className={`btn ${filterHall === eh.hall.code ? 'btn-primary' : ''}`}
                                            onClick={() => setFilterHall(eh.hall.code)}
                                        >
                                            {eh.hall.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn" onClick={exportSeatingCSV}>
                                        Export CSV
                                    </button>
                                    <button className="btn" onClick={exportSeatingExcel}>
                                        Export Excel
                                    </button>
                                </div>
                            </div>

                            <p className="mb-4 text-gray-600">
                                Showing {filteredSeats.length} seat assignments.
                                Students are shuffled in a round-robin pattern (1-1-1) across different levels.
                            </p>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Seat #</th>
                                        <th>Hall</th>
                                        <th>Matric No</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSeats.slice(0, 100).map((seat) => (
                                        <tr key={`${seat.hall.code}-${seat.seatNumber}`}>
                                            <td className="font-bold">{seat.seatNumber}</td>
                                            <td>{seat.hall.code}</td>
                                            <td className="font-mono">
                                                {seat.student.realMatric}
                                            </td>
                                            <td>{seat.student.name}</td>
                                            <td>{seat.student.level.department.name}</td>
                                            <td>{seat.student.level.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredSeats.length > 100 && (
                                <p className="mt-4 text-gray-600 text-center">
                                    Showing first 100 of {filteredSeats.length} seats (export to see all)
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
