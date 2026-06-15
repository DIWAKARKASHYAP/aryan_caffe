import type { AppView } from '../types'

export function parseUrlParams(): { view: AppView; table: number } {
  const params = new URLSearchParams(window.location.search)
  const viewParam = params.get('view')
  const tableParam = params.get('table')

  const view: AppView = viewParam === 'admin' ? 'admin' : 'customer'
  const table = tableParam ? Math.max(1, parseInt(tableParam, 10) || 1) : 1

  return { view, table }
}

export function buildCustomerUrl(table: number): string {
  const url = new URL(window.location.href)
  url.searchParams.set('view', 'customer')
  url.searchParams.set('table', String(table))
  return url.toString()
}

export function buildAdminUrl(): string {
  const url = new URL(window.location.href)
  url.searchParams.set('view', 'admin')
  url.searchParams.delete('table')
  return url.toString()
}
