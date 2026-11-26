/** Inline validation rules for the auth forms (C6.1). Each returns an auth:errors key or ''. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const MOBILE_RE = /^\+971\s?\d{1,2}\s?\d{3}\s?\d{4}$/

export const checkName = (v: string) => {
  const n = v.trim().length
  return n >= 2 && n <= 60 ? '' : 'name'
}
export const checkEmail = (v: string) => (EMAIL_RE.test(v.trim()) ? '' : 'email')
export const checkPassword = (v: string) => (v.length >= 8 && /\d/.test(v) ? '' : 'password')
export const checkMobile = (v: string) => (!v.trim() || MOBILE_RE.test(v.trim()) ? '' : 'mobile')
