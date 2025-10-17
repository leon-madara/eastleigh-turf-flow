import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { logInfo, logError } from '../utils/logger'

let app: App | null = null

export function getAdminApp() {
  if (app) return app

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    logError('firebase_admin_missing_env', {
      hasProjectId: Boolean(projectId),
      hasClientEmail: Boolean(clientEmail),
      hasPrivateKey: Boolean(privateKey),
    })
    throw new Error('Missing Firebase Admin credentials env vars')
  }

  // Support escaped newlines in env var
  privateKey = privateKey.replace(/\\n/g, '\n')

  app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
  logInfo('firebase_admin_initialized', { projectId })
  return app
}

export function getAdminAuth() {
  const app = getAdminApp()
  return getAuth(app)
}
