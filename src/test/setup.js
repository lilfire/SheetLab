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

// Node 22+ exposes an incomplete experimental localStorage that lacks
// setItem/removeItem/clear. Replace it with a simple in-memory Storage-like
// shim so tests that touch localStorage work consistently.
{
  const store = new Map()
  const shim = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)) },
    removeItem: (k) => { store.delete(k) },
    clear: () => { store.clear() },
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: shim,
    writable: true,
    configurable: true,
  })
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
      value: shim,
      writable: true,
      configurable: true,
    })
  }
}
