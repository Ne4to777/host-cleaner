/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist', 'node_modules', 'reports', 'debug'],
    testMatch: [
        '<rootDir>/__tests__/**/*.test.js',
    ],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.ts$': 'esbuild-runner/jest',
    },
};
