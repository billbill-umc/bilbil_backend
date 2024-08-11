import { sign, verify } from "jsonwebtoken";

/**
 *
 * @param {number} userId
 * @param {string} email
 * @param {string} username
 * @param {Date} expirationDate
 * @return {Promise<string>}
 */
export async function generateToken(userId, email, username, expirationDate) {
    const secrets = process.env.TOKEN_SECRET;

    return new Promise((resolve, reject) => {
        sign({
            sub: email,
            aud: userId,
            username,
            exp: Math.floor(expirationDate.valueOf() / 1000),
            iat: Math.floor(Date.now().valueOf() / 1000)
        }, secrets, (err, token) => {
            if (err) {
                return reject(err);
            }

            return resolve(token);
        });
    });
}

/**
 *
 * @param {string} token
 * @return {Promise<{sub: string, aud: number, username: string, exp: number, iat: number}>}
 */
export async function verifyToken(token) {
    const secrets = process.env.TOKEN_SECRET;

    return new Promise((resolve, reject) => {
        verify(token, secrets, (err, decoded) => {
            if (err) {
                return reject(err);
            }

            return resolve(decoded);
        });
    });
}
