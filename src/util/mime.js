import { extension } from "mime-types";

/**
 * @param {string} mime
 * @return {boolean|string}
 */
export function mimeToExt(mime) {
    return extension(mime);
}
