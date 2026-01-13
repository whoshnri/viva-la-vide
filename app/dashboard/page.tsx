import { getCurrentFaculty, getDashboardStats } from '@/lib/logic'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const faculty = await getCurrentFaculty()
    if (!faculty) redirect('/login')

    const stats = await getDashboardStats(faculty.id)

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="stat-card group hover:border-[#4A7044] transition-colors">
                    <div className="stat-value group-hover:scale-110 transition-transform origin-left">{stats.hallCount}</div>
                    <div className="stat-label">Halls</div>
                </div>
                <div className="stat-card group hover:border-[#4A7044] transition-colors">
                    <div className="stat-value group-hover:scale-110 transition-transform origin-left">{stats.departmentCount}</div>
                    <div className="stat-label">Departments</div>
                </div>
                <div className="stat-card group hover:border-[#4A7044] transition-colors">
                    <div className="stat-value group-hover:scale-110 transition-transform origin-left">{stats.studentCount}</div>
                    <div className="stat-label">Students</div>
                </div>
                <div className="stat-card group hover:border-[#4A7044] transition-colors">
                    <div className="stat-value group-hover:scale-110 transition-transform origin-left">{stats.examCount}</div>
                    <div className="stat-label">Exams</div>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <a href="/dashboard/halls" className="btn hover:border-[#4A7044] group">
                        Manage Halls
                    </a>
                    <a href="/dashboard/students" className="btn hover:border-[#4A7044] group">
                        Manage Students
                    </a>
                    <a href="/dashboard/exams" className="btn btn-primary shadow-none">
                        Create Exam
                    </a>
                </div>
            </div>
        </div>
    )
}
