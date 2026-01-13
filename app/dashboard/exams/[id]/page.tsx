import { getCurrentFaculty, getExamById } from '@/lib/logic'
import { redirect, notFound } from 'next/navigation'
import ExamDetailClient from './ExamDetailClient'

export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const faculty = await getCurrentFaculty()
    if (!faculty) redirect('/login')

    const { id } = await params
    const exam = await getExamById(id)

    if (!exam || exam.facultyId !== faculty.id) {
        notFound()
    }

    return <ExamDetailClient exam={{
        ...exam,
        date: exam.date.toISOString(),
        seatAssignments: exam.seatAssignments.sort((a, b) => {
            if (a.hall.code !== b.hall.code) return a.hall.code.localeCompare(b.hall.code)
            return a.seatNumber - b.seatNumber
        })
    }} />
}
