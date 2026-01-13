import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentFaculty } from '@/lib/logic'
import { logoutAction } from '@/lib/actions'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const faculty = await getCurrentFaculty()

    if (!faculty) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen flex">
            <aside className="sidebar">
                <div className="mb-10 px-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight uppercase">VIVA-LA-VIDA</h1>
                    </div>

                    <div className="px-3 py-2 bg-gray-100 rounded-lg">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Faculty</p>
                        <p className="text-sm font-semibold truncate" title={faculty.name}>{faculty.name}</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <Link href="/dashboard" className="sidebar-link group">
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/dashboard/halls" className="sidebar-link group">
                        <span className="font-medium">Halls</span>
                    </Link>
                    <Link href="/dashboard/students" className="sidebar-link group">
                        <span className="font-medium">Students</span>
                    </Link>
                    <Link href="/dashboard/exams" className="sidebar-link group">
                        <span className="font-medium">Exams</span>
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-200">
                    <form action={logoutAction}>
                        <button type="submit" className="btn w-full justify-start gap-3 bg-red-50 hover:bg-red-100 border-red-100 text-red-700">
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
