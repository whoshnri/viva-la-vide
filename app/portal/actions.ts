'use server'

import prisma from '@/lib/db'

export async function checkSeatAllocation(matricNo: string) {
    if (!matricNo) return { error: 'Matriculation number is required' }

    try {
        const student = await prisma.student.findFirst({
            where: { realMatric : matricNo },
            include: {
                level: { include: { department: { include: { faculty: true } } } },
                seatAssignments: {
                    include: {
                        exam: true,
                        hall: true
                    },
                    orderBy: { exam: { date: 'asc' } }
                }
            }
        })

        if (!student) {
            return { error: 'Student not found' }
        }



        return { student }
    } catch (error) {
        console.error('Error fetching allocation:', error)
        return { error: 'Failed to fetch allocation details' }
    }
}
