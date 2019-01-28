import Web3Service from '../Web3Service';

describe('Web3 Service', () => {
  let web3Svc;

  beforeAll(() => {
    web3Svc = new Web3Service('http://localhost:8545');
  });

  test('getLatestBlockchainTime', async () => {
    try {
      const { time, hash } = await web3Svc.getLatestBlockchainTime();
      expect(time).toBeDefined();
      expect(hash).toBeDefined();
    } catch (error) {
      throw error;
    }
  });
});
