'use client'

import { useState } from 'react'
import { checkSeatAllocation } from './actions'

type StudentData = Awaited<ReturnType<typeof checkSeatAllocation>>['student']

export default function StudentPortal() {
    const [matricNo, setMatricNo] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState<StudentData | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setData(null)

        try {
            const result = await checkSeatAllocation(matricNo)

            if (result.error) {
                setError(result.error)
            } else {
                setData(result.student)
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 font-sans text-gray-900 flex flex-col items-center">
            {/* SEARCH SECTION (Hidden on Print) */}
            <div className="w-full max-w-md mt-10 print:hidden transition-all duration-300 ease-in-out">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <h1 className="text-2xl font-bold text-center mb-6 text-[#4A7044] tracking-tight">Student Exam Portal</h1>
                    <form onSubmit={handleSearch} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Matriculation Number</label>
                            <input
                                type="text"
                                value={matricNo}
                                onChange={(e) => setMatricNo(e.target.value)}
                                className="input text-lg py-3 px-4"
                                placeholder="Enter Matric No (e.g., F/ND/23/321061)"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4A7044] text-white btn py-3 px-4 font-semibold hover:bg-[#3d5c38] hover:shadow-md transition-all disabled:opacity-70 disabled:shadow-none flex justify-center items-center text-base rounded-lg"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-55" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Check Allocation'
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* RESULTS SECTION (Visible on Print) */}
            {data && (
                <div style={{
                    zoom : .85
                }}
                 className="w-full max-w-3xl mt-8 bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 print:shadow-none print:border-none print:w-full print:mt-0 print:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* SLIP HEADER */}
                    <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#4A7044] uppercase tracking-wide">Examination Seat Slip</h2>
                            <p className="text-gray-500 font-medium mt-1">Viva La Vida University</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#4A7044]/10 text-[#4A7044] text-xs font-bold uppercase tracking-wider">
                                Official Slip
                            </div>
                        </div>
                    </div>

                    {/* STUDENT DETAILS */}
                    <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-10 text-sm">
                        <div className="group">
                            <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">Student Name</p>
                            <p className="font-bold text-lg text-gray-900 group-hover:text-[#4A7044] transition-colors">{data.name}</p>
                        </div>
                        <div className="text-right group">
                            <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">Matriculation Number</p>
                            <p className="font-bold text-lg text-gray-900 font-mono group-hover:text-[#4A7044] transition-colors">
                                {data.realMatric}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">Department & Faculty</p>
                            <p className="font-semibold text-gray-900 text-base">{data.level.department.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">Faculty of {data.level.department.faculty.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">Level</p>
                            <p className="font-semibold text-gray-900 text-base">{data.level.name}</p>
                        </div>
                    </div>

                    {/* EXAM TABLE */}
                    <div className="mb-10">
                        <h3 className="text-Base font-bold text-[#4A7044] mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Allocated Exams
                        </h3>
                        {data.seatAssignments.length === 0 ? (
                            <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                                <p className="text-gray-500 text-sm">No seat allocations found for upcoming exams.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-600 print:bg-gray-100">
                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Exam Title</th>
                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Date & Time</th>
                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Venue</th>
                                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500 text-center">Seat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {data.seatAssignments.map((assignment) => (
                                            <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 font-medium text-gray-900 border-none">{assignment.exam.title}</td>
                                                <td className="p-4 border-none">
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        {new Date(assignment.exam.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                                                        {new Date(assignment.exam.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="p-4 border-none">
                                                    <div className="font-bold text-gray-900 text-sm">{assignment.hall.code}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[150px]" title={assignment.hall.name}>{assignment.hall.name}</div>
                                                </td>
                                                <td className="p-4 text-center border-none">
                                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#4A7044]/10 text-[#4A7044] font-bold text-sm ring-1 ring-[#4A7044]/20">
                                                        {assignment.seatNumber}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* INSTRUCTIONS & INFO */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Important Instructions</h3>
                        <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4 marker:text-gray-300">
                            <li>Please arrive at the examination hall at least <strong>30 minutes</strong> before the scheduled time.</li>
                            <li>You must present this <strong>Seat Slip</strong> and your <strong>Student ID Card</strong> for verification.</li>
                            <li>Electronic devices, including mobile phones and smartwatches, are <strong>strictly prohibited</strong> inside the hall.</li>
                            <li>Malpractice of any kind will result in immediate disqualification and disciplinary action by the Faculty Board.</li>
                        </ul>
                    </div>

                    {/* FOOTER */}
                    <div className="text-center text-gray-400 text-[10px] mt-10 print:mt-10 pt-4 border-t border-gray-50 flex justify-between items-center uppercase tracking-wider font-medium">
                        <p>© {new Date().getFullYear()} Viva La Vida University</p>
                        <p>Generated: {new Date().toLocaleString()}</p>
                    </div>

                    {/* PRINT BUTTON (Hidden on Print) */}
                    <div className="mt-10 text-center print:hidden">
                        <button
                            onClick={handlePrint}
                            className="bg-white text-gray-900 border border-gray-200 py-2.5 px-6 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 mx-auto rounded-lg shadow-sm hover:shadow text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.198-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                            Print Seat Slip
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
