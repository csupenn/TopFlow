// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfills for jsdom environment (required for MSW)
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream } from 'stream/web'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream

// Polyfill Headers first (needed by Request and Response)
global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = new Map()
    if (init) {
      if (init instanceof Headers) {
        init._headers.forEach((value, key) => {
          this._headers.set(key, value)
        })
      } else if (typeof init === 'object') {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value)
        })
      }
    }
  }

  get(name) {
    const value = this._headers.get(name.toLowerCase())
    return value !== undefined ? value : null
  }

  set(name, value) {
    this._headers.set(name.toLowerCase(), value)
  }

  has(name) {
    return this._headers.has(name.toLowerCase())
  }

  forEach(callback) {
    this._headers.forEach(callback)
  }
}

// Polyfill Request
global.Request = class Request {
  constructor(url, init = {}) {
    this.url = url
    this.method = init.method || 'GET'
    this.headers = init.headers instanceof global.Headers ? init.headers : new global.Headers(init.headers || {})
    this.body = init.body
    this._bodyInit = init.body
  }

  async json() {
    return JSON.parse(this._bodyInit)
  }

  // Standard Request API; routes that must size-check or parse the body themselves use it.
  async text() {
    return this._bodyInit == null ? '' : String(this._bodyInit)
  }
}

// Polyfill Response
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = init.statusText || 'OK'
    this.headers = new global.Headers(init.headers || {})
  }

  static json(data, init = {}) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...init.headers,
      },
    })
  }

  async json() {
    return JSON.parse(this.body)
  }

  async text() {
    return this.body
  }
}

// Mock next/navigation for testing
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock window.matchMedia (guard: not available in @jest-environment node tests)
if (typeof window !== 'undefined') Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock
