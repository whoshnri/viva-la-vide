import { checkDatabaseConnection } from '@/lib/logic'
import { NextResponse } from 'next/server'

export async function GET() {
    const status = await checkDatabaseConnection()
    return NextResponse.json(status)
}
