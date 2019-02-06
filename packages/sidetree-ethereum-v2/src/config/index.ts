import dotenv from 'dotenv';
dotenv.config({ path: process.env.DOTENV_PATH });

import ethereumUtils from '../util/ethereum';

// tslint:disable-next-line
const AnchorContractArtifact = require("../../build/contracts/SimpleSidetreeAnchor.json");

export const app = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.APP_PORT || '3000'
};

let mnemonic = '';
if (!process.env.MNEMONIC) {
  throw new Error('MNEMONIC is required environment variable.');
} else {
  mnemonic = process.env.MNEMONIC;
}

export default {
  app,
  AnchorContractArtifact,
  mnemonic,
  sidetreeEthereumNodeAccount: ethereumUtils.mnemonicToAccount(
    mnemonic,
    "m/44'/60'/0'/0 /0"
  )
};
