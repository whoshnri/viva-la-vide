import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-[#4A7044] selection:text-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">VIVA-LA-VIDA</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/portal" className="text-sm font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors">
              Student Portal
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary h-11 px-6 text-xs uppercase tracking-widest font-bold shadow-none rounded-xl">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Hero Text */}
          <div className="space-y-10">
            <div className="inline-block px-4 py-2 bg-[#4A7044]/10 text-[#4A7044] rounded-full text-xs font-bold uppercase tracking-widest border border-[#4A7044]/20">
              Exam Allocation System
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[1.05]">
              SEAMLESS<br />
              <span className="text-[#4A7044]">DISTRIBUTION</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              The ultimate platform for managing university examination seats, halls, and student allocations with precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="btn btn-primary px-8 py-4 h-auto text-sm uppercase tracking-widest shadow-none">
                Get Started
              </Link>
              <Link href="/portal" className="btn px-8 py-4 h-auto text-sm uppercase tracking-widest shadow-none bg-gray-50 hover:bg-gray-100 border-gray-200">
                Check Status
              </Link>
            </div>
          </div>

          {/* Modular Cards Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card hover:border-[#4A7044] transition-colors group cursor-default">
              <h3 className="font-bold text-lg mb-2 uppercase tracking-tight">Hall Management</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Maximize venue utilization with smart capacity planning and auto-assignment.
              </p>
            </div>
            <div className="card hover:border-[#4A7044] transition-colors group cursor-default mt-0 sm:mt-12">
              <h3 className="font-bold text-lg mb-2 uppercase tracking-tight">Student Tracking</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Real-time database of students efficiently mapped to upcoming exams.
              </p>
            </div>
            <div className="card hover:border-[#4A7044] transition-colors group cursor-default">
              <h3 className="font-bold text-lg mb-2 uppercase tracking-tight">Auto-Shuffle</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Prevent malpractice with our intelligent randomized seating algorithm.
              </p>
            </div>
            <div className="card hover:border-[#4A7044] transition-colors group cursor-default mt-0 sm:mt-12">
              <h3 className="font-bold text-lg mb-2 uppercase tracking-tight">Instant Reports</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Generate and print exam seat slips and attendance sheets in seconds.
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-black rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h4 className="font-bold text-sm tracking-wide">VIVA-LA-VIDA</h4>
          </div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">&copy; {new Date().getFullYear()} University Systems.</p>
        </div>
      </footer>
    </div>
  )
}
