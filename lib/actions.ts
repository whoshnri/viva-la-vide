'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
    createFaculty,
    authenticateFaculty,
    createToken,
    getCurrentFaculty,
    createHall,
    updateHall,
    deleteHall,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    createLevel,
    updateLevel,
    deleteLevel,
    createStudent,
    createManyStudents,
    updateStudent,
    deleteStudent,
    createExam,
    deleteExam,
    generateExamDistribution,
    generateSeatingArrangement
} from '@/lib/logic'

// Response type for all actions
type ActionResponse = { success: true } | { error: string }

// ==================== AUTH ACTIONS ====================

export async function registerAction(data: { name: string; email: string; password: string }): Promise<ActionResponse> {
    if (!data.name || !data.email || !data.password) {
        return { error: 'All fields are required' }
    }

    try {
        const faculty = await createFaculty(data)
        const token = await createToken(faculty.id)

        const cookieStore = await cookies()
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return { success: true }
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return { error: 'Email already exists' }
        }
        return { error: 'Failed to create account' }
    }
}

export async function loginAction(data: { email: string; password: string }): Promise<ActionResponse> {
    if (!data.email || !data.password) {
        return { error: 'All fields are required' }
    }

    try {
        const faculty = await authenticateFaculty(data.email, data.password)

        if (!faculty) {
            return { error: 'Invalid email or password' }
        }

        const token = await createToken(faculty.id)

        const cookieStore = await cookies()
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        })

        return { success: true }
    } catch {
        return { error: 'Login failed' }
    }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
    redirect('/login')
}

export async function requireAuth() {
    const faculty = await getCurrentFaculty()
    if (!faculty) {
        redirect('/login')
    }
    return faculty
}

// ==================== HALL ACTIONS ====================

export async function createHallAction(data: { name: string; code: string; capacity: number }): Promise<ActionResponse> {
    try {
        const faculty = await requireAuth()

        if (!data.name || !data.code || !data.capacity) {
            return { error: 'All fields are required' }
        }

        await createHall({ ...data, facultyId: faculty.id })
        revalidatePath('/dashboard/halls')
        return { success: true }
    } catch {
        return { error: 'Failed to create hall' }
    }
}

export async function updateHallAction(id: string, data: { name: string; code: string; capacity: number }): Promise<ActionResponse> {
    try {
        await requireAuth()
        await updateHall(id, data)
        revalidatePath('/dashboard/halls')
        return { success: true }
    } catch {
        return { error: 'Failed to update hall' }
    }
}

export async function deleteHallAction(id: string): Promise<ActionResponse> {
    try {
        await requireAuth()
        await deleteHall(id)
        revalidatePath('/dashboard/halls')
        return { success: true }
    } catch {
        return { error: 'Failed to delete hall' }
    }
}

// ==================== DEPARTMENT ACTIONS ====================

export async function createDepartmentAction(data: { name: string; matricFormat: string }): Promise<ActionResponse> {
    try {
        const faculty = await requireAuth()

        if (!data.name || !data.matricFormat) {
            return { error: 'All fields are required' }
        }

        await createDepartment({ ...data, facultyId: faculty.id })
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to create department' }
    }
}

export async function updateDepartmentAction(id: string, data: { name: string; matricFormat: string }): Promise<ActionResponse> {
    try {
        await requireAuth()
        await updateDepartment(id, data)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to update department' }
    }
}

export async function deleteDepartmentAction(id: string): Promise<ActionResponse> {
    try {
        await requireAuth()
        await deleteDepartment(id)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to delete department' }
    }
}

// ==================== LEVEL ACTIONS ====================

export async function createLevelAction(data: { name: string; departmentId: string }): Promise<ActionResponse> {
    try {
        await requireAuth()

        if (!data.name) {
            return { error: 'Level name is required' }
        }

        await createLevel(data)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to create level' }
    }
}

export async function updateLevelAction(id: string, data: { name: string }): Promise<ActionResponse> {
    try {
        await requireAuth()
        await updateLevel(id, data)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to update level' }
    }
}

export async function deleteLevelAction(id: string): Promise<ActionResponse> {
    try {
        await requireAuth()
        await deleteLevel(id)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to delete level' }
    }
}

// ==================== STUDENT ACTIONS ====================

export async function createStudentAction(data: { matricNo: string; name: string; levelId: string }): Promise<ActionResponse> {
    try {
        await requireAuth()

        if (!data.matricNo || !data.name) {
            return { error: 'All fields are required' }
        }

        await createStudent(data)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to create student' }
    }
}

export async function uploadStudentsAction(data: { levelId: string; csvContent: string }): Promise<ActionResponse & { count?: number }> {
    try {
        await requireAuth()

        const lines = data.csvContent.split('\n').filter(line => line.trim())

        // Skip header if present
        const startIndex = lines[0]?.toLowerCase().includes('matric') ? 1 : 0

        const students: { matricNo: string; name: string; levelId: string }[] = []

        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim())
            if (parts.length >= 2) {
                students.push({
                    matricNo: parts[0],
                    name: parts[1],
                    levelId: data.levelId
                })
            }
        }

        if (students.length === 0) {
            return { error: 'No valid students found in file' }
        }

        await createManyStudents(students)
        revalidatePath('/dashboard/students')
        return { success: true, count: students.length }
    } catch {
        return { error: 'Failed to upload students' }
    }
}

export async function updateStudentAction(id: string, data: { matricNo: string; name: string }): Promise<ActionResponse> {
    try {
        await requireAuth()
        await updateStudent(id, data)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to update student' }
    }
}

export async function deleteStudentAction(id: string): Promise<ActionResponse> {
    try {
        await requireAuth()
        await deleteStudent(id)
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch {
        return { error: 'Failed to delete student' }
    }
}

// ==================== EXAM ACTIONS ====================

export async function createExamAction(data: { title: string; date: string; hallIds: string[]; levelIds: string[] }): Promise<ActionResponse & { examId?: string }> {
    try {
        const faculty = await requireAuth()

        if (!data.title || !data.date || data.hallIds.length === 0 || data.levelIds.length === 0) {
            return { error: 'All fields are required' }
        }

        const exam = await createExam({
            title: data.title,
            date: new Date(data.date),
            facultyId: faculty.id,
            hallIds: data.hallIds,
            levelIds: data.levelIds
        })

        revalidatePath('/dashboard/exams')
        return { success: true, examId: exam.id }
    } catch {
        return { error: 'Failed to create exam' }
    }
}

export async function deleteExamAction(id: string): Promise<ActionResponse> {
    try {
        await requireAuth()
        await deleteExam(id)
        revalidatePath('/dashboard/exams')
        return { success: true }
    } catch {
        return { error: 'Failed to delete exam' }
    }
}

export async function generateAllocationAction(examId: string){
    try {
        await requireAuth()
        await generateExamDistribution(examId)
        await generateSeatingArrangement(examId)
        revalidatePath(`/dashboard/exams/${examId}`)
        return { success: true }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message }
        }
        return { error: 'Failed to generate allocation' }
    }
}
