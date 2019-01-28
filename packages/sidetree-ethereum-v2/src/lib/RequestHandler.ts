import { Response, ResponseStatus } from './Response';
import nodeFetch from 'node-fetch';
import * as HttpStatus from 'http-status';
import TransactionNumber from './TransactionNumber';

import Web3Service from './Web3Service';
// Based on https://github.com/decentralized-identity/sidetree-bitcoin/blob/master/src/RequestHandler.ts

/**
 * Sidetree Ethereum request handler class
 */
export default class RequestHandler {
  public web3Svc: Web3Service;
  /**
   * @param web3ProviderUrl URI for the blockchain service
   */
  public constructor (public web3ProviderUrl: string) {
    this.web3Svc = new Web3Service(this.web3ProviderUrl);
  }

  /**
   * Returns the blockhash of the last block in the blockchain
   */
  public async handleLastBlockRequest (): Promise<Response> {
    try {
      const { time, hash } = await this.web3Svc.getLatestBlockchainTime();
      return {
        status: ResponseStatus.Succeeded,
        body: {
          time,
          hash
        }
      };
    } catch (e) {
      return {
        status: ResponseStatus.ServerError,
        body: {
          message: 'failed to getLatestBlockchainTime from web3Svc.'
        }
      };
    }
  }
}
