import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const segments = (await params).path.join('/')
    if (!segments) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 })
    }

    // 1. Sanitize the incoming path segment directly to prevent directory traversal
    const safeSegments = path.normalize(segments).replace(/^(\.\.[\/\\])+/, '')

    // 2. Resolve the uploads root. In docker (process.env.UPLOAD_PATH === '/app/public') we look at /app/public/uploads.
    // In local development we look directly at projectRoot/uploads.
    const uploadsRoot = process.env.UPLOAD_PATH 
      ? path.join(process.env.UPLOAD_PATH, 'uploads')
      : path.join(process.cwd(), 'uploads')

    // 3. Construct absolute path cleanly.
    const fullPath = path.join(uploadsRoot, safeSegments)

    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const ext = path.extname(fullPath).toLowerCase()

    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
