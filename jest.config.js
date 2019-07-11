module.exports = {
  setupFilesAfterEnv: [
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '[^/]*\\.test.tsx?$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
    },
  },
}
