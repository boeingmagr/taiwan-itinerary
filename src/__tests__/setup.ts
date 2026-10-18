// jsdom doesn't implement matchMedia, which PrimeVue components (e.g. DatePicker)
// call on mount. Provide a plain stub — plain functions, not vi.fn(), so the
// `restoreMocks: true` config can't wipe it between tests.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  })
}

// Also missing from jsdom; some PrimeVue components observe element size.
if (!('ResizeObserver' in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: ResizeObserverStub as unknown as typeof ResizeObserver,
  })
}
