module.exports = {
  roots: ['<rootDir>/packages/ctx/src', '<rootDir>/src/__tests__'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};
