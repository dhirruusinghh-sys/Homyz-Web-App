// Utility: merge Tailwind classes safely
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format large numbers
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K'
  return String(n)
}

// Ease functions for GSAP
export const ease = {
  spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  out:    'cubic-bezier(0.22, 1, 0.36, 1)',
  in:     'cubic-bezier(0.55, 0, 1, 0.45)',
}
