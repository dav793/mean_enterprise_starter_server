const crypto = require('crypto');

/**
 * generate a random 16-character-long hex string intended to function as the salt portion of an encrypted password
 *
 * @return the generated salt string
 */
export function getSalt(): string {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * encrypt a plain password string into a 64-character-long hex string
 *
 * @return the encrypted password as a hex string
 */
export function getHash(salt: string, password: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');
}
