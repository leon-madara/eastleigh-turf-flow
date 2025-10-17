import { logInfo, logError } from './logger'

type NewUserPayload = {
  type: 'NEW_PENDING_USER'
  phoneE164: string
  uid: string
  createdAt: string
}

export async function notifyNewPendingUser(phoneE164: string, uid: string) {
  const payload: NewUserPayload = {
    type: 'NEW_PENDING_USER',
    phoneE164,
    uid,
    createdAt: new Date().toISOString(),
  }
  const urls = (process.env.NOTIFY_WEBHOOK_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (!urls.length) {
    logInfo('notify_pending_user_log_only', { phoneE164, uid })
    return
  }

  await Promise.all(urls.map(async (url) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      logInfo('notify_pending_user_sent', { url, status: res.status })
    } catch (err: any) {
      logError('notify_pending_user_error', { url, message: err?.message })
    }
  }))
}

