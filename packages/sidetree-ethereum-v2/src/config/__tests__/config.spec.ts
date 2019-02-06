import config from '../index';

describe('Config', () => {
  describe('sidetreeEthereumNodeAccount', () => {
    test('uses mneumonic to create sidetreeEthereumNodeAccount', async () => {
      const { sidetreeEthereumNodeAccount } = config;
      expect(sidetreeEthereumNodeAccount.address).toBeDefined();
      expect(sidetreeEthereumNodeAccount.publicKey).toBeDefined();
      expect(sidetreeEthereumNodeAccount.privateKey).toBeDefined();
    });
  });
});
