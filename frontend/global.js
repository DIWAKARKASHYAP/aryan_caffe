/** Single source of truth for the backend API base URL (no trailing slash). */
export const BASE_API = 'https://aryan-caffe-api.vercel.app'

// Local development — uncomment and comment the line above:
// export const BASE_API = 'http://localhost:3001'

/** Normalize base URL — always includes protocol. */
export function normalizeBaseApi(url) {
  const trimmed = (url || BASE_API).trim().replace(/\/$/, '')
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/** Full API prefix, e.g. https://aryan-caffe-api.vercel.app/api */
export function getApiBase(envUrl) {
  return `${normalizeBaseApi(envUrl)}/api`
}
