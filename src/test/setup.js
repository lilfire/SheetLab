import '@testing-library/jest-dom'

// Stub ResizeObserver for jsdom (not available in the test environment)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// Stub document.fonts for jsdom (not available in the test environment)
if (typeof document !== 'undefined' && !document.fonts) {
  document.fonts = { ready: Promise.resolve() }
}
