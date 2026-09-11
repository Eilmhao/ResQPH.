/**
 * Single line-art icon family used across the marketing site and app.
 * Consistent 24x24 stroke so every feature/step reads as one set.
 */
import type { ReactNode } from 'react'

export type IconName =
  | 'alert'
  | 'pin'
  | 'volunteers'
  | 'shield'
  | 'report'
  | 'connect'
  | 'respond'
  | 'recover'
  | 'route'
  | 'clock'
  | 'wifi-off'
  | 'logout'
  | 'menu'
  | 'play'
  | 'phone'
  | 'check'
  | 'close'
  | 'plus'
  | 'camera'
  | 'boat'
  | 'warning'
  | 'user'
  | 'chevron-right'
  | 'medical'
  | 'refresh'
  | 'eye'
  | 'eye-off'

interface IconProps {
  name: IconName
  size?: number
}

const paths: Record<IconName, ReactNode> = {
  alert: (
    <>
      <path d="M12 3.5 22 20H2L12 3.5Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </>
  ),
  volunteers: (
    <>
      <circle cx="8.5" cy="8" r="2.6" />
      <circle cx="16" cy="9" r="2.2" />
      <path d="M3.5 19c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8" />
      <path d="M14.5 14.5c2.4-.2 5 1.4 5 4.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 5.5v5.2C5 15.7 8.1 19.3 12 21c3.9-1.7 7-5.3 7-10.3V5.5L12 3Z" />
      <path d="m9 11.5 2 2 4-4.2" />
    </>
  ),
  report: (
    <>
      <path d="M12 3.5 22 20H2L12 3.5Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  connect: (
    <>
      <circle cx="8.5" cy="8" r="2.6" />
      <circle cx="16" cy="9" r="2.2" />
      <path d="M3.5 19c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8" />
      <path d="M14.5 14.5c2.4-.2 5 1.4 5 4.5" />
    </>
  ),
  respond: (
    <>
      <path d="M12 3 5 5.5v5.2C5 15.7 8.1 19.3 12 21c3.9-1.7 7-5.3 7-10.3V5.5L12 3Z" />
      <path d="m9 11.5 2 2 4-4.2" />
    </>
  ),
  recover: (
    <path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 6.9a4.4 4.4 0 0 1 8.5 2c0 6.1-8.5 11.6-8.5 11.6Z" />
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h5.5a3.5 3.5 0 0 0 0-7H10a3.5 3.5 0 0 1 0-5h6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  'wifi-off': (
    <>
      <path d="M3 5l18 18" />
      <path d="M8.8 12.9a6 6 0 0 1 6.7-.5" />
      <path d="M5 9.5a11 11 0 0 1 4-2.3M19 9.5a11 11 0 0 0-4.6-2.4" />
      <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="M17 8l4 4-4 4M21 12H9" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  close: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  boat: (
    <>
      <path d="M2 19c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
      <path d="M4 14l2-6h12l2 6z" />
      <path d="M12 2v6" />
    </>
  ),
  warning: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  'chevron-right': <polyline points="9 18 15 12 9 6" />,
  medical: (
    <>
      <path d="M12 4v16" />
      <path d="M4 12h16" />
    </>
  ),
  refresh: (
    <>
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.4-5 9.5-5 9.5 5 9.5 5-3.4 5-9.5 5-9.5-5-9.5-5Z" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  'eye-off': (
    <>
      <path d="m3 3 18 18" />
      <path d="M10.6 7.2A10.7 10.7 0 0 1 12 7c6.1 0 9.5 5 9.5 5a16 16 0 0 1-3.1 3.2" />
      <path d="M6.2 6.8C3.8 8.2 2.5 12 2.5 12s3.4 5 9.5 5c.8 0 1.5-.1 2.2-.3" />
    </>
  ),
}

export function Icon({ name, size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths[name]}
    </svg>
  )
}
