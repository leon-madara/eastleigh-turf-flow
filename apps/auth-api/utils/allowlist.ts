const parseList = (envName: string, fallback: string[] = []) => {
  const raw = process.env[envName] || ''
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return list.length ? list : fallback
}

export const allowedPhones = () => parseList('ALLOWLIST_PHONES', ['+254704505523'])
export const adminPhones = () => parseList('ALLOWLIST_ADMIN_PHONES', ['+254704505523'])

export function isAllowedPhone(phoneE164: string) {
  return allowedPhones().includes(phoneE164)
}

export function isAdminPhone(phoneE164: string) {
  return adminPhones().includes(phoneE164)
}

