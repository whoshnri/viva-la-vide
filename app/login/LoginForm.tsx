'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from '@/lib/actions'

export default function LoginForm({ dbOnline }: { dbOnline: boolean }) {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await loginAction({ email, password })

        if ('error' in result) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <img src="/logo.png" alt="YCT Logo" className="h-16 w-auto" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Login</h1>
                    <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">YCT Exam Allocation System</p>
                </div>

                {!dbOnline && (
                    <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-lg text-sm text-center">
                        <p className="font-semibold text-red-700">
                            Database is offline. Please try again later.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="name@example.com"
                            required
                            disabled={!dbOnline}
                        />
                    </div>

                    <div className="form-group">
                        <div className="flex justify-between items-center mb-1">
                            <label className="form-label mb-0" htmlFor="password">Password</label>
                            <Link href="#" className="text-xs font-bold text-gray-400 hover:text-[#007A33] transition-colors uppercase tracking-widest">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                            disabled={!dbOnline}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="error-text text-center text-red-600 m-0">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full h-11 text-base shadow-md hover:shadow-lg transition-all"
                        disabled={loading || !dbOnline}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-black text-[#007A33] hover:underline uppercase tracking-widest">
                        Register School
                    </Link>
                </p>
            </div>
        </div>
    )
}
