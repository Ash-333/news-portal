import * as jwt from 'jsonwebtoken'
import { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-super-secret-key-here-change-in-production'
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m'
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d'

interface TokenPayload {
  id: string
  email: string
  role: string
}

interface GeneratedTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY } as SignOptions)
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY } as SignOptions)
}

export function generateTokens(payload: TokenPayload): GeneratedTokens {
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)
  
  // Decode to get expiry time
  const decoded = jwt.decode(accessToken) as { exp: number }
  const expiresIn = decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 900 // 15 minutes default
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
  }
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export function refreshAccessToken(refreshToken: string): GeneratedTokens | null {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload
    return generateTokens(decoded)
  } catch {
    return null
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload
  } catch {
    return null
  }
}
