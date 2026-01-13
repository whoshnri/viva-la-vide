'use client'

import { useEffect, useState } from 'react'

export default function DbStatus({ initialStatus }: { initialStatus: boolean }) {
    const [isOnline, setIsOnline] = useState(initialStatus)
    const [checking, setChecking] = useState(false)

    const checkStatus = async () => {
        setChecking(true)
        try {
            const res = await fetch('/api/db-status')
            const data = await res.json()
            setIsOnline(data.online)
        } catch {
            setIsOnline(false)
        }
        setChecking(false)
    }

    // Check every 30 seconds
    useEffect(() => {
        const interval = setInterval(checkStatus, 30000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div
            className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-none hover:bg-gray-50 transition-all cursor-pointer z-50 group font-mono"
            onClick={checkStatus}
            title="Click to refresh connection status"
        >
            <span className={`relative flex h-2.5 w-2.5`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-green-400' : 'bg-red-400'} ${checking ? 'opacity-100 duration-75' : 'duration-1000'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 group-hover:text-black transition-colors">
                {checking ? 'Checking...' : isOnline ? 'System Online' : 'System Offline'}
            </span>
        </div>
    )
}
