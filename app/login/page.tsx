import { redirect } from 'next/navigation'
import { getCurrentFaculty, checkDatabaseConnection } from '@/lib/logic'
import LoginForm from './LoginForm'

export default async function LoginPage() {
    const dbStatus = await checkDatabaseConnection()

    // If user is already logged in, redirect to dashboard
    if (dbStatus.online) {
        const faculty = await getCurrentFaculty()
        if (faculty) {
            redirect('/dashboard')
        }
    }

    return <LoginForm dbOnline={dbStatus.online} />
}
