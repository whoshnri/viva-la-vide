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
                    <div className="flex items-center gap-3 mb-8">
                        <img src="/logo.png" alt="YCT Logo" className="h-10 w-auto" />
                        <h1 className="text-xl font-black tracking-tighter text-gray-900 leading-none">YCT EXAMS</h1>
                    </div>
                    <div className="px-4 py-3 bg-[#fbbf24]/20 rounded-xl border border-[#fbbf24]/30 shadow-sm">
                       
                        <p className="text-sm font-black truncate text-[#007A33]" title={faculty.name}>{faculty.name}</p>
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
