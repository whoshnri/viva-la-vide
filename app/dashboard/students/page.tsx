import { getCurrentFaculty, getDepartments } from '@/lib/logic'
import { redirect } from 'next/navigation'
import StudentsClient from './StudentsClient'
import prisma from '@/lib/db'

export default async function StudentsPage() {
    const faculty = await getCurrentFaculty()
    if (!faculty) redirect('/login')

    // Get departments with levels and students
    const departments = await prisma.department.findMany({
        where: { facultyId: faculty.id },
        include: {
            levels: {
                include: {
                    students: { orderBy: { matricNo: 'asc' } },
                    _count: { select: { students: true } }
                },
                orderBy: { name: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    })

    return <StudentsClient departments={departments} />
}
