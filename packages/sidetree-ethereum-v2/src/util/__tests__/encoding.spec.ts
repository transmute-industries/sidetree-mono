import encoding from '../encoding';

import fixtures from '../../../test/__fixtures__';

describe('encoding', () => {
  test('encodeBase58FromBuffer', async () => {
    const base58EncodedAnchorFileHash = await encoding.encodeBase58FromBuffer(
      Buffer.from(fixtures.hexEncodedAnchorFileHash, 'hex')
    );
    expect(base58EncodedAnchorFileHash).toBe(
      fixtures.base58EncodedAnchorFileHash
    );
  });

  test('encodeBase58FromString', async () => {
    const encoded = await encoding.encodeBase58FromString('hello 🦄');
    expect(encoded).toBe('6sBRWytUgTFfto');
  });

  test('decodeBase58ToString', async () => {
    const decodedUtf8 = await encoding.decodeBase58ToString('6sBRWytUgTFfto');
    expect(decodedUtf8).toBe('hello 🦄');
  });

  test('getBytes32FromSHA256Hash', async () => {
    const bytes32 = await encoding.getBytes32FromSHA256Hash(
      'QmSW83grYtAft3b18QkoefrFKy6HSmhij69yDzzCrUztAk'
    );
    expect(bytes32).toBe(
      '0x3ddbe2be8cfc5313f6160bfa263651f000fb70e5a6af72f3de798fa58933f3d9'
    );
  });
  test('getMultiHashFromBytes32', async () => {
    const multihash = await encoding.getMultiHashFromBytes32(
      '0x3ddbe2be8cfc5313f6160bfa263651f000fb70e5a6af72f3de798fa58933f3d9'
    );
    expect(multihash).toBe('QmSW83grYtAft3b18QkoefrFKy6HSmhij69yDzzCrUztAk');
  });
});
