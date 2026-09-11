/**
 * ResQPH mark: a rescue-red aid cross / starburst, echoing the wordmark
 * in the brand. Reads as a relief/aid symbol at any size.
 */
interface ResqLogoProps {
  size?: number
  title?: string
}

export function ResqLogo({ size = 34, title = 'ResQPH' }: ResqLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="resq-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8463c" />
          <stop offset="1" stopColor="#a51f19" />
        </linearGradient>
      </defs>
      {/* Four-point aid star with concave sides */}
      <path
        fill="url(#resq-star)"
        d="M20 1c1.6 8.3 5 11.7 13.3 13.3v.6C25 16.5 21.6 19.9 20 28.2h-.6C17.8 19.9 14.4 16.5 6.1 14.9v-.6C14.4 12.7 17.8 9.3 19.4 1Z"
        transform="translate(0 6)"
      />
      <path
        fill="url(#resq-star)"
        opacity="0.55"
        d="M8 2.5c.7 3.6 2.1 5 5.7 5.7v.3C10.1 9.2 8.7 10.6 8 14.2h-.3C7 10.6 5.6 9.2 2 8.5v-.3C5.6 7.5 7 6.1 7.7 2.5Z"
        transform="translate(24 20) scale(0.7)"
      />
    </svg>
  )
}
