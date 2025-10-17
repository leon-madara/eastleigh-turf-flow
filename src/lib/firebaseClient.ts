import { initializeApp, getApps } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
}

let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const auth = getAuth(app)

export function getOrCreateRecaptcha(containerId: string) {
  // Attach an invisible reCAPTCHA verifier to the provided container
  const existing = (window as any)._recaptchaVerifier as RecaptchaVerifier | undefined
  if (existing) return existing

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  })
  ;(window as any)._recaptchaVerifier = verifier
  return verifier
}

export async function requestPhoneOtp(e164Phone: string) {
  const verifier = getOrCreateRecaptcha('recaptcha-container')
  return signInWithPhoneNumber(auth, e164Phone, verifier)
}

export async function confirmOtp(confirmation: ConfirmationResult, code: string) {
  return confirmation.confirm(code)
}

