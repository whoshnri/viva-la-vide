import { redirect } from 'next/navigation'
import { getCurrentFaculty, checkDatabaseConnection } from '@/lib/logic'
import RegisterForm from './RegisterForm'

export default async function RegisterPage() {
    const dbStatus = await checkDatabaseConnection()

    // If user is already logged in, redirect to dashboard
    if (dbStatus.online) {
        const faculty = await getCurrentFaculty()
        if (faculty) {
            redirect('/dashboard')
        }
    }

    return <RegisterForm dbOnline={dbStatus.online} />
}
