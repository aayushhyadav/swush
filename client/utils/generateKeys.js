const openpgp = require('openpgp');

/**
 * Generate public/private key pairs for encryption and decryption.
 *
 * @param email the email of the authenticated user
 *
 * @returns an object containing the generated public/private key pair
 */
export default async function generateKeys(email) {
  const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
    type: 'ecc',
    curve: 'curve25519',
    userIds: { email },
    passphrase: 'secret',
  });

  return { privateKey: privateKeyArmored, publicKey: publicKeyArmored };
}
