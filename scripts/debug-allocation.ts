
require('dotenv').config()
import prisma from "@/lib/db"
// COPIED LOGIC (Modified to remove next/headers)
export async function generateExamDistribution(examId: string) {
    // Get exam with halls and levels
    const exam = await prisma.examEvent.findUnique({
        where: { id: examId },
        include: {
            examHalls: { include: { hall: true } },
            examLevels: { include: { level: { include: { students: true } } } }
        }
    })

    if (!exam) throw new Error('Exam not found')

    // Calculate total capacity and total students
    const totalCapacity = exam.examHalls.reduce((sum, eh) => sum + eh.hall.capacity, 0)
    const allStudents = exam.examLevels.flatMap(el => el.level.students)
    const totalStudents = allStudents.length

    if (totalCapacity < totalStudents) {
        throw new Error(`Insufficient capacity: ${totalCapacity} seats for ${totalStudents} students`)
    }

    // Clear existing distributions
    await prisma.examDistribution.deleteMany({ where: { examId } })

    // Distribute students proportionally across halls
    // Track startIndex and endIndex to know which students go to which hall
    const distributions: any[] = []

    // Track current position in each level's student list
    const levelPointers = new Map<string, number>()
    for (const examLevel of exam.examLevels) {
        levelPointers.set(examLevel.levelId, 0)
    }

    for (const examHall of exam.examHalls) {
        const hallShare = examHall.hall.capacity / totalCapacity

        for (const examLevel of exam.examLevels) {
            const levelStudentCount = examLevel.level.students.length
            // Calculate how many from this level go to this hall
            const allocated = Math.floor(levelStudentCount * hallShare)

            const startIndex = levelPointers.get(examLevel.levelId) || 0
            const endIndex = startIndex + allocated - 1

            // FIX logic: if allocated is 0, we can't really have a valid range. 
            // But strict logic says:
            // if allocated > 0, range is [startIndex, endIndex]
            // if allocated == 0, maybe we shouldn't push? 
            // The original logic pushed it anyway:
            // endIndex: allocated > 0 ? endIndex : startIndex - 1

            // Let's keep original logic to see if it reproduces the "empty" issue.

            distributions.push({
                examId,
                hallId: examHall.hallId,
                levelId: examLevel.levelId,
                allocatedCount: allocated,
                startIndex,
                endIndex: allocated > 0 ? endIndex : startIndex - 1
            })

            // Update pointer
            levelPointers.set(examLevel.levelId, startIndex + allocated)
        }
    }

    // Handle remainders - assign unallocated students
    for (const examLevel of exam.examLevels) {
        const levelTotal = examLevel.level.students.length
        const currentPointer = levelPointers.get(examLevel.levelId) || 0
        let remaining = levelTotal - currentPointer

        // Distribute remaining to halls that have capacity
        for (const examHall of exam.examHalls) {
            if (remaining <= 0) break

            const hallAllocated = distributions
                .filter(d => d.hallId === examHall.hallId)
                .reduce((sum, d) => sum + d.allocatedCount, 0)

            const hallRemainingCapacity = examHall.hall.capacity - hallAllocated

            if (hallRemainingCapacity > 0) {
                const toAdd = Math.min(remaining, hallRemainingCapacity)

                // Find the distribution entry to update
                const dist = distributions.find(d => d.hallId === examHall.hallId && d.levelId === examLevel.levelId)

                if (dist) {
                    dist.allocatedCount += toAdd
                    dist.endIndex += toAdd
                    remaining -= toAdd

                    // Update level pointer
                    levelPointers.set(examLevel.levelId, (levelPointers.get(examLevel.levelId) || 0) + toAdd)
                }
            }
        }
    }

    // Save distributions
    await prisma.examDistribution.createMany({ data: distributions })

    return distributions
}


// async function main() {
//     console.log('--- Starting Debug Script (Isolated Logic) ---')

//     // 1. Cleanup
//     try {
//         await prisma.examEvent.deleteMany({ where: { title: 'DEBUG_EXAM' } })
//         await prisma.student.deleteMany({ where: { matricNo: { startsWith: 'DEBUG_' } } })
//         await prisma.level.deleteMany({ where: { name: 'DEBUG_LEVEL' } })
//         await prisma.hall.deleteMany({ where: { name: 'DEBUG_HALL' } })
//         const oldFaculty = await prisma.faculty.findUnique({ where: { email: 'debug@test.com' } })
//         if (oldFaculty) {
//             await prisma.faculty.delete({ where: { id: oldFaculty.id } })
//         }
//     } catch (e) {
//         console.log('Cleanup minor error (ignoring):', e)
//     }

//     // 2. Setup Data
//     console.log('Creating Faculty...')
//     const faculty = await prisma.faculty.create({
//         data: { name: 'Debug Faculty', email: 'debug@test.com', password: 'hash' }
//     })

//     console.log('Creating Department & Level...')
//     const dept = await prisma.department.create({
//         data: { name: 'Debug Dept', matricFormat: 'DEBUG', facultyId: faculty.id }
//     })
//     const level = await prisma.level.create({
//         data: { name: 'DEBUG_LEVEL', departmentId: dept.id }
//     })

//     console.log('Creating Hall...')
//     const hall = await prisma.hall.create({
//         data: { name: 'DEBUG_HALL', code: 'DH', capacity: 100, facultyId: faculty.id }
//     })

//     console.log('Creating 50 Students...')
//     const studentsData = Array.from({ length: 50 }).map((_, i) => ({
//         matricNo: `DEBUG_${i}`,
//         name: `Student ${i}`,
//         levelId: level.id
//     }))
//     await prisma.student.createMany({ data: studentsData })

//     console.log('Creating Exam...')
//     const exam = await prisma.examEvent.create({
//         data: {
//             title: 'DEBUG_EXAM',
//             date: new Date(),
//             facultyId: faculty.id,
//             examHalls: { create: { hallId: hall.id } },
//             examLevels: { create: { levelId: level.id } }
//         }
//     })

//     // 3. Run Logic
//     console.log('Running generateExamDistribution...')
//     const dists = await generateExamDistribution(exam.id)

//     console.log('Distributions returned:')
//     console.dir(dists, { depth: null })

//     // 4. Verify DB
//     console.log('Fetching Distributions from DB...')
//     const savedDists = await prisma.examDistribution.findMany({
//         where: { examId: exam.id }
//     })
//     console.log('Saved Distributions:', savedDists)

//     const invalid = savedDists.filter(d => d.startIndex === undefined || d.startIndex === null || d.endIndex === undefined || d.endIndex === null)
//     if (invalid.length > 0) {
//         console.error('FAILED: Found distributions with missing indices:', invalid)
//     } else {
//         console.log('SUCCESS: All distributions have indices.')
//     }
// }

// main()
//     .catch(e => console.error(e))
//     .finally(() => prisma.$disconnect())
