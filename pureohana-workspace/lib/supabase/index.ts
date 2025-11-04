/**
 * Pure Ohana Treasures - Supabase Client Exports
 *
 * Centralized exports for all Supabase functionality.
 * Import from this file for cleaner, more maintainable code.
 */

// Client utilities
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { updateSession } from './session-helper'

// Type exports
export type * from './types'
