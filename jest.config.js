/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  "setupFilesAfterEnv": ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      isolatedModules: true
    }],
  }};