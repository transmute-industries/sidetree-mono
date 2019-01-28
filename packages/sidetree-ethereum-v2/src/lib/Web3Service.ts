
// tslint:disable-next-line
const Web3 = require('web3');

export default class Web3Service {
  public web3: any;
  constructor (public providerUrl: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  }

  // https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#get-latest-blockchain-time
  public getLatestBlockchainTime = async () => {
    const blockNumber = await this.web3.eth.getBlockNumber();
    const unPrefixedBlockhash = (await this.web3.eth.getBlock(
      blockNumber
    )).hash.replace('0x', '');
    return {
      time: blockNumber,
      hash: unPrefixedBlockhash
    };
  }
}
