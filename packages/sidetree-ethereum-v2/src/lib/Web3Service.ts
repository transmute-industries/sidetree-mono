// tslint:disable-next-line
const Web3 = require("web3");
const contract = require('truffle-contract');
// tslint:disable-next-line
const HDWalletProvider = require("truffle-hdwallet-provider");
// const WebSocketProvider = require('web3-provider-engine/subproviders/websocket');

import config from '../config';

export default class Web3Service {
  public web3: any;
  public anchorContractArtifact: any;

  public anchorContract: any;

  private provider: any;

  constructor (public providerUrl: string) {
    const isLocal = providerUrl.indexOf('localhost') !== -1;
    const subProvider = new Web3.providers.WebsocketProvider(providerUrl);
    this.provider = isLocal
      ? subProvider
      : new HDWalletProvider(config.mnemonic, subProvider);
    this.web3 = new Web3(this.provider);
    this.anchorContractArtifact = config.AnchorContractArtifact;
    this.anchorContract = contract(this.anchorContractArtifact);
    this.anchorContract.setProvider(this.web3.currentProvider);
  }

  // https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#get-latest-blockchain-time
  public getLatestBlockchainTime = async () => {
    const blockNumber = await this.web3.eth.getBlockNumber();
    return this.getBlockchainTime(blockNumber);
  }

  public getBlockchainTime = async (
    blockHashOrBlockNumber: number | string
  ) => {
    const block = await this.web3.eth.getBlock(blockHashOrBlockNumber);

    const unPrefixedBlockhash = block.hash.replace('0x', '');
    return {
      time: block.number,
      hash: unPrefixedBlockhash
    };
  }

  public anchorHash = async (bytes32EncodedHash: string) => {
    const instance = await this.anchorContract.deployed();
    return instance.anchorHash(bytes32EncodedHash, {
      from: config.sidetreeEthereumNodeAccount.address
    });
  }

  public getTransactions = async (fromBlock: number = 0) => {
    const instance = await this.anchorContract.deployed();
    const logs = await instance.getPastEvents('Anchor', {
      // TODO: add indexing here... https://ethereum.stackexchange.com/questions/8658/what-does-the-indexed-keyword-do
      fromBlock,
      toBlock: 'latest'
    });
    return logs.map((log: any) => {
      return {
        transactionTime: log.blockNumber,
        transactionTimeHash: log.blockHash,
        transactionNumber: log.args.transactionNumber.toNumber(),
        anchorFileHash: log.args.anchorFileHash.replace('0x', '')
      };
    });
  }

  public getTransactionsSince = async (
    transactionNumber: number,
    transactionTimeHash: string
  ) => {
    const { time, hash } = await this.getBlockchainTime(transactionTimeHash);
    const transactions = await this.getTransactions(time);
    return transactions.filter((t: any) => {
      return t.transactionNumber > transactionNumber;
    });
  }

  public subscribeToAnchorEvents = async (callback: Function) => {
    const instance = await this.anchorContract.deployed();
    const subscription = instance.Anchor(callback);
    return subscription;
  }

  public stop = () => {
    this.provider.engine.stop();
    this.web3.currentProvider.engine.stop();
    this.web3.setProvider(null);
    this.web3 = null;
    return true;
  }
}
