import { format, formatDistanceToNow } from 'date-fns'

/**
 * Formats a date string or Date object into a human-readable format.
 * Used throughout the app for displaying timestamps.
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy · h:mm a')
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}