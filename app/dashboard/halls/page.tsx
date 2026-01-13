import { getCurrentFaculty, getHalls } from '@/lib/logic'
import { redirect } from 'next/navigation'
import HallsClient from './HallsClient'

export default async function HallsPage() {
    const faculty = await getCurrentFaculty()
    if (!faculty) redirect('/login')

    const halls = await getHalls(faculty.id)

    return <HallsClient halls={halls} />
}
