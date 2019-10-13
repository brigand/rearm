module.exports = {
  roots: ['<rootDir>/packages/ctx/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};
