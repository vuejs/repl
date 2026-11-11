import { createDefaultPreset } from 'ts-jest'

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} **/
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  moduleNameMapper: {
    '^.+\\?raw$': '<rootDir>/jest.raw-mock.js',
    '\\.vue$': '<rootDir>/jest.raw-mock.js',
    '^monaco-editor-core$': '<rootDir>/jest.monaco-mock.js',
  },
}
