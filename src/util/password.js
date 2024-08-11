import { pbkdf2, randomBytes } from "crypto";

export function generateSalt() {
    return randomBytes(64).toString("base64");
}

export async function hashingPassword(password, salt) {
    return new Promise((resolve, reject) => {
        pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            resolve(derivedKey.toString("base64"));
        });
    });
}
