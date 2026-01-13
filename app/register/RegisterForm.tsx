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
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create an Account</h1>
                    <p className="text-sm text-gray-500 mt-2">Join Viva La Vida University Exam Allocator</p>
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
                        <label className="form-label" htmlFor="name">Faculty Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            placeholder="e.g. Faculty of Science"
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

                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-black hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
