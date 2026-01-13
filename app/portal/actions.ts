'use server'

import prisma from '@/lib/db'

export async function checkSeatAllocation(matricNo: string) {
    if (!matricNo) return { error: 'Matriculation number is required' }
    // get the last 3 characters of the matricNo
    const lastThree = matricNo.slice(-3)

    // get the level code (3 numbers before the last 3 characters)
    const levelCode = matricNo.slice(0, -3)


    try {
        const student = await prisma.student.findFirst({
            where: { matricNo : lastThree },
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
