const openpgp = require('openpgp');

/**
 * Generate public/private key pairs for encryption and decryption.
 *
 * @param email the email of the authenticated user
 *
 * @returns an object containing the generated public/private key pair
 */
export default async function generateKeys(email) {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'ecc',
    curve: 'curve25519',
    userIDs: { email },
    passphrase: process.env.PASSPHRASE,
  });

  return { privateKey, publicKey };
}
