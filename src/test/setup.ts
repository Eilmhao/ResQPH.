import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Ensure the rendered DOM is torn down between tests so queries stay isolated.
afterEach(() => {
  cleanup()
})
