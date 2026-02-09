'use server'

import prisma from './db'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-change-in-production')

// ==================== DATABASE STATUS ====================
export async function checkDatabaseConnection(): Promise<{ online: boolean; error?: string }> {
    try {
        // Use the imported singleton instance
        await prisma.faculty.findFirst({ select: { id: true } });
        return { online: true };
    } catch (error) {
        // ... (Your error handling logic, now much more likely to catch a real DB error)
        console.error(error)
        return {
            online: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

//==================== AUTH ====================

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export async function createToken(facultyId: string): Promise<string> {
    return new SignJWT({ facultyId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload as { facultyId: string }
    } catch {
        return null
    }
}

export async function getCurrentFaculty() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload) return null

    const faculty = await prisma.faculty.findUnique({
        where: { id: payload.facultyId }
    })

    return faculty
}

export async function createFaculty(data: { name: string; email: string; password: string }) {
    const hashedPassword = await hashPassword(data.password)

    const faculty = await prisma.faculty.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        }
    })

    return faculty
}

export async function authenticateFaculty(email: string, password: string) {
    const faculty = await prisma.faculty.findUnique({
        where: { email }
    })

    if (!faculty) return null

    const isValid = await verifyPassword(password, faculty.password)
    if (!isValid) return null

    return faculty
}

// ==================== HALLS ====================

export async function getHalls(facultyId: string) {
    return prisma.hall.findMany({
        where: { facultyId },
        orderBy: { name: 'asc' }
    })
}

export async function createHall(data: { name: string; code: string; capacity: number; facultyId: string }) {
    return prisma.hall.create({ data })
}

export async function updateHall(id: string, data: { name?: string; code?: string; capacity?: number }) {
    return prisma.hall.update({ where: { id }, data })
}

export async function deleteHall(id: string) {
    return prisma.hall.delete({ where: { id } })
}

// ==================== DEPARTMENTS ====================

export async function getDepartments(facultyId: string) {
    return prisma.department.findMany({
        where: { facultyId },
        include: {
            levels: {
                include: {
                    _count: { select: { students: true } }
                }
            }
        },
        orderBy: { name: 'asc' }
    })
}

export async function createDepartment(data: { name: string; facultyId: string}) {

    try {
        const dept = await prisma.department.create({
            data: {
                name: data.name,
                facultyId: data.facultyId,
            }
        })


        return { success: true }
    }
    catch (err) {
        console.log("Im here", err)

        return { success: false }
    }
}

export async function updateDepartment(id: string, data: { name?: string }) {
    return prisma.department.update({ where: { id }, data })
}

export async function deleteDepartment(id: string) {
    return prisma.department.delete({ where: { id } })
}

// ==================== LEVELS ====================

export async function getLevels(departmentId: string) {
    return prisma.level.findMany({
        where: { departmentId },
        include: {
            _count: { select: { students: true } }
        },
        orderBy: { name: 'asc' }
    })
}

export async function createLevel(data: { name: string; departmentId: string, matricFormat : string}) {
    return prisma.level.create({ data })
}

export async function updateLevel(id: string, data: { name?: string }) {
    return prisma.level.update({ where: { id }, data })
}

export async function deleteLevel(id: string) {
    return prisma.level.delete({ where: { id } })
}

// ==================== STUDENTS ====================

export async function getStudents(levelId: string) {
    return prisma.student.findMany({
        where: { levelId },
        orderBy: { matricNo: 'asc' }
    })
}

export async function createStudent(data: { matricNo: string; name: string; levelId: string }) {
    // get the department and level
    const level = await prisma.level.findUnique({ where: { id: data.levelId }, include: { department: true } })
    const realMatric = `${level?.matricFormat}0${data.matricNo}`
    return prisma.student.create({ data: { ...data, realMatric } })
}

export async function createManyStudents(students: { matricNo: string; name: string; levelId: string }[]) {
    // get the level from the level Id of one student 
    const testCase = students[0]
    const level = await prisma.level.findUnique({ where: { id: testCase.levelId }, include: { department: true } })

    const realMatricConstructor = `${level?.matricFormat}0`

    const newStudents = students.map(student => ({
        ...student,
        realMatric: realMatricConstructor + student.matricNo
    }))

    // update the matric no
    return prisma.student.createMany({ data: newStudents, skipDuplicates: true })
}

export async function updateStudent(id: string, data: { matricNo?: string; name?: string }) {
    return prisma.student.update({ where: { id }, data })
}

export async function deleteStudent(id: string) {
    return prisma.student.delete({ where: { id } })
}

// ==================== EXAMS ====================

export async function getExams(facultyId: string) {
    return prisma.examEvent.findMany({
        where: { facultyId },
        include: {
            examHalls: { include: { hall: true } },
            examLevels: { include: { level: { include: { department: true, _count: { select: { students: true } } } } } },
            _count: { select: { seatAssignments: true } }
        },
        orderBy: { date: 'desc' }
    })
}

export async function getExamById(id: string) {
    return prisma.examEvent.findUnique({
        where: { id },
        include: {
            examHalls: { include: { hall: true } },
            examLevels: { include: { level: { include: { department: true, _count: { select: { students: true } } } } } },
            examDistributions: { include: { hall: true, level: { include: { department: true } } } },
            seatAssignments: { include: { student: { include: { level: { include: { department: true } } } }, hall: true } }
        }
    })
}

export async function createExam(data: {
    title: string;
    date: Date;
    facultyId: string;
    hallIds: string[];
    levelIds: string[]
}) {
    const exam = await prisma.examEvent.create({
        data: {
            title: data.title,
            date: data.date,
            facultyId: data.facultyId,
            examHalls: {
                create: data.hallIds.map(hallId => ({ hallId }))
            },
            examLevels: {
                create: data.levelIds.map(levelId => ({ levelId }))
            }
        }
    })

    return exam
}

export async function deleteExam(id: string) {
    // Delete in order due to relations
    await prisma.seatAssignment.deleteMany({ where: { examId: id } })
    await prisma.examDistribution.deleteMany({ where: { examId: id } })
    await prisma.examLevel.deleteMany({ where: { examId: id } })
    await prisma.examHall.deleteMany({ where: { examId: id } })
    return prisma.examEvent.delete({ where: { id } })
}

// ==================== ALLOCATION ALGORITHMS ====================

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

    // Step 1: Calculate Allocation Plan (Counts per Hall per Level)
    const hallCapacities = new Map<string, number>()
    const hallAllocatedTotal = new Map<string, number>()

    exam.examHalls.forEach(eh => {
        hallCapacities.set(eh.hallId, eh.hall.capacity)
        hallAllocatedTotal.set(eh.hallId, 0)
    })

    // Prepare map: LevelId -> HallId -> Count
    const allocationPlan = new Map<string, Map<string, number>>()
    const levelStudentCounts = new Map<string, number>()

    for (const el of exam.examLevels) {
        allocationPlan.set(el.levelId, new Map())
        levelStudentCounts.set(el.levelId, el.level.students.length)
        for (const eh of exam.examHalls) {
            allocationPlan.get(el.levelId)!.set(eh.hallId, 0)
        }
    }

    // Distribute Proportional
    for (const el of exam.examLevels) {
        const studentCount = levelStudentCounts.get(el.levelId)!

        for (const eh of exam.examHalls) {
            // Use simple floor to be safe, we handle remainders later
            const hallShare = eh.hall.capacity / totalCapacity
            const count = Math.floor(studentCount * hallShare)

            // Update plan
            const levelMap = allocationPlan.get(el.levelId)!
            levelMap.set(eh.hallId, count)

            // Update hall total
            hallAllocatedTotal.set(eh.hallId, hallAllocatedTotal.get(eh.hallId)! + count)
        }
    }

    // Distribute Remainders
    for (const el of exam.examLevels) {
        let allocatedSoFar = 0
        const levelMap = allocationPlan.get(el.levelId)!
        for (const val of levelMap.values()) allocatedSoFar += val

        let remaining = levelStudentCounts.get(el.levelId)! - allocatedSoFar

        if (remaining > 0) {
            // Find halls with spare capacity
            for (const eh of exam.examHalls) {
                if (remaining <= 0) break

                const currentUsage = hallAllocatedTotal.get(eh.hallId)!
                const capacity = hallCapacities.get(eh.hallId)!
                const spare = capacity - currentUsage

                if (spare > 0) {
                    const toAdd = Math.min(remaining, spare)

                    // Update plan
                    levelMap.set(eh.hallId, levelMap.get(eh.hallId)! + toAdd)

                    // Update global trackers
                    hallAllocatedTotal.set(eh.hallId, currentUsage + toAdd)
                    remaining -= toAdd
                }
            }
        }
    }

    // Step 2: Generate Distributions entries with correct indices
    const distributions: { examId: string; hallId: string; levelId: string; allocatedCount: number; startIndex: number; endIndex: number }[] = []

    for (const el of exam.examLevels) {
        let currentIndex = 0
        const levelMap = allocationPlan.get(el.levelId)!

        // Iterate halls in consistent order to ensure contiguous assignment matches our plan
        for (const eh of exam.examHalls) {
            const count = levelMap.get(eh.hallId) || 0

            if (count > 0) {
                const startIndex = currentIndex
                const endIndex = startIndex + count - 1

                distributions.push({
                    examId,
                    hallId: eh.hallId,
                    levelId: el.levelId,
                    allocatedCount: count,
                    startIndex,
                    endIndex
                })

                currentIndex += count
            }
        }
    }

    // Save distributions
    await prisma.examDistribution.createMany({ data: distributions })

    return distributions
}


export async function generateSeatingArrangement(examId: string) {
    // Get exam with distributions and students
    const exam = await prisma.examEvent.findUnique({
        where: { id: examId },
        include: {
            examHalls: { include: { hall: true } },
            examDistributions: {
                include: {
                    level: {
                        include: {
                            students: { orderBy: { matricNo: 'asc' } },
                            department: true
                        }
                    }
                }
            }
        }
    })

    if (!exam) throw new Error('Exam not found')

    // Clear existing seat assignments
    await prisma.seatAssignment.deleteMany({ where: { examId } })

    const seatAssignments: { examId: string; hallId: string; studentId: string; seatNumber: number }[] = []

    // Process each hall
    for (const examHall of exam.examHalls) {
        // Get distributions for this hall
        const hallDistributions = exam.examDistributions.filter(d => d.hallId === examHall.hallId)

        // Build student lists for each level in this hall
        interface StudentWithLevel {
            id: string
            levelId: string
            departmentName: string
            levelName: string
        }

        const levelStudentLists: StudentWithLevel[][] = []

        for (const dist of hallDistributions) {
            // Use the stored startIndex and endIndex from the distribution
            const students = dist.level.students.slice(dist.startIndex, dist.endIndex + 1)

            const mappedStudents: StudentWithLevel[] = students.map(s => ({
                id: s.id,
                levelId: dist.levelId,
                departmentName: dist.level.department.name,
                levelName: dist.level.name
            }))
            if (mappedStudents.length > 0) {
                levelStudentLists.push(mappedStudents)
            }
        }

        // Round-robin interleave: 1-1-1-1 pattern
        let seatNumber = 1
        const pointers = levelStudentLists.map(() => 0)
        let exhaustedCount = 0

        while (exhaustedCount < levelStudentLists.length) {
            for (let i = 0; i < levelStudentLists.length; i++) {
                if (pointers[i] < levelStudentLists[i].length) {
                    const student = levelStudentLists[i][pointers[i]]
                    seatAssignments.push({
                        examId,
                        hallId: examHall.hallId,
                        studentId: student.id,
                        seatNumber
                    })
                    seatNumber++
                    pointers[i]++

                    if (pointers[i] >= levelStudentLists[i].length) {
                        exhaustedCount++
                    }
                }
            }
        }
    }

    // Save seat assignments
    await prisma.seatAssignment.createMany({ data: seatAssignments })

    return seatAssignments
}

// ==================== STATS ====================

export async function getDashboardStats(facultyId: string) {
    const [hallCount, departmentCount, studentCount, examCount] = await Promise.all([
        prisma.hall.count({ where: { facultyId } }),
        prisma.department.count({ where: { facultyId } }),
        prisma.student.count({ where: { level: { department: { facultyId } } } }),
        prisma.examEvent.count({ where: { facultyId } })
    ])

    return { hallCount, departmentCount, studentCount, examCount }
}
