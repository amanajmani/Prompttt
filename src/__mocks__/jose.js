// Mock for jose library to prevent ESM issues in Jest
module.exports = {
  compactDecrypt: jest.fn(),
  compactEncrypt: jest.fn(),
  jwtVerify: jest.fn(),
  SignJWT: jest.fn(),
  importSPKI: jest.fn(),
  importPKCS8: jest.fn(),
  generateKeyPair: jest.fn(),
};
