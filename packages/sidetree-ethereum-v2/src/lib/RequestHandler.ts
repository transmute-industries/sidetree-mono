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

  private isValidAnchorFileHash = (data: string) => {
    const re = /[0-9A-Fa-f]{64}/g;
    return re.test(data) && data.toLowerCase() === data;
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

  /**
   * Returns the blockNumber for a given hash
   */
  public async handleBlockNumberFromBlockHash (blockNumber: number): Promise<Response> {
    try {
      const { time, hash } = await this.web3Svc.getBlockchainTime(blockNumber);
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
          message: 'failed to getBlockchainTime from web3Svc.'
        }
      };
    }
  }

  /**
   * Handles sidetree transaction anchor request
   * @param requestBody Request body containing the anchor file hash.
   */
  public async handleAnchorRequest (requestBody: Buffer): Promise<any> {
    const jsonBody = JSON.parse(requestBody.toString());
    const anchorFileHash = jsonBody.anchorFileHash;

    // Respond with '400' if no anchor file hash was given.
    if (!anchorFileHash) {
      return {
        status: ResponseStatus.BadRequest
      };
    }

    // Respond with '400' if no anchor file hash is not lower case hex string
    if (!this.isValidAnchorFileHash(anchorFileHash)) {
      return {
        status: ResponseStatus.BadRequest
      };
    }

    this.web3Svc.anchorHash('0x' + anchorFileHash);

    return {
      status: ResponseStatus.Succeeded
    };
  }

  /**
   * Handles sidetree transaction anchor request
   * @param requestBody Request body containing the anchor file hash.
   */
  public async handleReadTransactions (since: number, transactionTimeHash: string): Promise<any> {

    const currentTime = await this.web3Svc.getLatestBlockchainTime();
    let transactions;

    if (!since || !transactionTimeHash) {
      transactions = await this.web3Svc.getTransactions(0);
    } else {
      transactions = await this.web3Svc.getTransactionsSince(since, transactionTimeHash);

    }

    return {
      status: ResponseStatus.Succeeded,
      body: {
        moreTransactions: transactions[transactions.length - 1].transactionNumber === currentTime.time,
        transactions
      }
    };
  }
}
