// Jest TypeScript declarations
import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'

declare global {
  var jest: typeof import('jest')
  var expect: typeof import('@jest/globals').expect
  var describe: typeof import('@jest/globals').describe
  var it: typeof import('@jest/globals').it
  var beforeAll: typeof import('@jest/globals').beforeAll
  var afterAll: typeof import('@jest/globals').afterAll
  var beforeEach: typeof import('@jest/globals').beforeEach
  var afterEach: typeof import('@jest/globals').afterEach
}

export {}