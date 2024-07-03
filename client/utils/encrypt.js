const openpgp = require('openpgp');

export default async function encryptSecret(publicKeys, secret) {
  const publicKeysArmored = publicKeys;

  const pubKeys = await Promise.all(
    publicKeysArmored.map((armoredKey) => openpgp.readKey({ armoredKey }))
  );

  const message = await openpgp.createMessage({text: secret});
  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: pubKeys,
  });

  return encrypted;
}
