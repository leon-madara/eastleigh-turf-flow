type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase()
const levelOrder: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 }
const currentLevel = (levelOrder[envLevel as LogLevel] ?? 20)

function shouldLog(level: LogLevel) {
  return levelOrder[level] >= currentLevel
}

function safeStringify(obj: unknown) {
  try {
    return JSON.stringify(obj)
  } catch {
    return '[unstringifiable]'
  }
}

function base(entry: Record<string, unknown>) {
  return {
    ts: new Date().toISOString(),
    ...entry,
  }
}

export function logDebug(event: string, data?: Record<string, unknown>) {
  if (!shouldLog('debug')) return
  // eslint-disable-next-line no-console
  console.log(safeStringify(base({ level: 'debug', event, ...data })))
}

export function logInfo(event: string, data?: Record<string, unknown>) {
  if (!shouldLog('info')) return
  // eslint-disable-next-line no-console
  console.log(safeStringify(base({ level: 'info', event, ...data })))
}

export function logWarn(event: string, data?: Record<string, unknown>) {
  if (!shouldLog('warn')) return
  // eslint-disable-next-line no-console
  console.warn(safeStringify(base({ level: 'warn', event, ...data })))
}

export function logError(event: string, data?: Record<string, unknown>) {
  if (!shouldLog('error')) return
  // eslint-disable-next-line no-console
  console.error(safeStringify(base({ level: 'error', event, ...data })))
}

export function reqMeta(req: { method?: string; url?: string; headers?: any }) {
  const headers = req.headers || {}
  const origin = headers['origin'] as string | undefined
  const ua = headers['user-agent'] as string | undefined
  const ip =
    (headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
    (headers['x-real-ip'] as string | undefined) ||
    undefined
  return { method: req.method, url: req.url, origin, ua, ip }
}

export function errorMeta(err: any) {
  return {
    name: err?.name,
    message: err?.message,
    code: err?.code,
    stack: typeof err?.stack === 'string' ? String(err.stack).split('\n')[0] : undefined,
  }
}

