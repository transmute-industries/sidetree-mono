
import RequestHandler from './RequestHandler';

const uri = 'http://localhost:8545';

export const requestHandler = new RequestHandler(uri);

export { default as setKoaResponse } from './setKoaResponse';
