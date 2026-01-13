import { getCurrentFaculty, getExams } from '@/lib/logic'
import { redirect } from 'next/navigation'
import ExamsClient from './ExamsClient'
import prisma from '@/lib/db'

export default async function ExamsPage() {
    const faculty = await getCurrentFaculty()
    if (!faculty) redirect('/login')

    const exams = await getExams(faculty.id)
    const halls = await prisma.hall.findMany({ where: { facultyId: faculty.id } })
    const levels = await prisma.level.findMany({
        where: { department: { facultyId: faculty.id } },
        include: {
            department: true,
            _count: { select: { students: true } }
        }
    })

    // Serialize exams for client component
    const serializedExams = exams.map(exam => ({
        id: exam.id,
        title: exam.title,
        date: exam.date.toISOString(),
        examHalls: exam.examHalls.map(eh => ({
            hall: {
                id: eh.hall.id,
                name: eh.hall.name,
                code: eh.hall.code,
                capacity: eh.hall.capacity
            }
        })),
        examLevels: exam.examLevels.map(el => ({
            level: {
                id: el.level.id,
                name: el.level.name,
                department: {
                    name: el.level.department.name
                },
                _count: {
                    students: el.level._count.students
                }
            }
        })),
        _count: exam._count
    }))

    return <ExamsClient
        exams={serializedExams}
        halls={halls}
        levels={levels}
    />
}
