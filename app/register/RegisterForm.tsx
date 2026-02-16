'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerAction } from '@/lib/actions'

export default function RegisterForm({ dbOnline }: { dbOnline: boolean }) {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await registerAction({ name, email, password })

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
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Register</h1>
                    <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest leading-relaxed">Join YCT CS Allocation System</p>
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
                        <label className="form-label" htmlFor="name">School Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            placeholder="e.g. School of Computing"
                            required
                            disabled={!dbOnline}
                        />
                    </div>

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
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            minLength={6}
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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-black text-[#007A33] hover:underline uppercase tracking-widest">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
