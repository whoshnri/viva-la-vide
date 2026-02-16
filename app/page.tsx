import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-[#4A7044] selection:text-white">
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="YCT Logo" className="h-12 w-auto" />
            <h1 className="text-xl font-black tracking-tighter text-gray-900">YCT EXAM ALLOCATION</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/portal" className="text-sm font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors">
              Student Portal
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary h-11 px-8 text-xs uppercase tracking-widest font-black shadow-lg rounded-xl">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Hero Text */}
          <div className="space-y-10">
            <div className="inline-block px-4 py-2 bg-[#fbbf24]/20 text-[#1a1a1a] rounded-full text-xs font-black uppercase tracking-widest border border-[#fbbf24]/30">
              Official Allocation System
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[0.95]">
              YCT CS<br />
              <span className="text-[#007A33]">ALLOCATION</span>
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed max-w-lg font-medium">
              Official platform for managing computer science examination seats, halls, and student allocations at Yaba College of Technology.
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
            <div className="card hover:border-[#007A33] transition-all hover:-translate-y-1 cursor-default">
              <h3 className="font-black text-xl mb-3 uppercase tracking-tight text-[#007A33]">Hall Management</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Maximize venue utilization with smart capacity planning and auto-assignment.
              </p>
            </div>
            <div className="card hover:border-[#007A33] transition-all hover:-translate-y-1 cursor-default mt-0 sm:mt-12">
              <h3 className="font-black text-xl mb-3 uppercase tracking-tight text-[#007A33]">Student Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Real-time database of students efficiently mapped to upcoming exams.
              </p>
            </div>
            <div className="card hover:border-[#007A33] transition-all hover:-translate-y-1 cursor-default">
              <h3 className="font-black text-xl mb-3 uppercase tracking-tight text-[#007A33]">Auto-Shuffle</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Prevent malpractice with our intelligent randomized seating algorithm.
              </p>
            </div>
            <div className="card hover:border-[#007A33] transition-all hover:-translate-y-1 cursor-default mt-0 sm:mt-12">
              <h3 className="font-black text-xl mb-3 uppercase tracking-tight text-[#007A33]">Instant Reports</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Generate and print exam seat slips and attendance sheets in seconds.
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="YCT Logo" className="h-8 w-auto grayscale opacity-50" />
            <h4 className="font-black text-sm tracking-tight text-gray-400">YCT EXAM ALLOCATION</h4>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} Yaba College of Technology.</p>
        </div>
      </footer>
    </div>
  )
}
