/**
 * @typedef {Object} BaseResponse
 * @property {boolean} success
 * @property {string} code
 * @property {string} message
 */

/**
 * @typedef {Object} Response<T>
 *     @extends BaseResponse
 * @template T
 * @property {T} data
 */

/**
 * @template T
 * @param {BaseResponse} base
 * @param {T} body
 * @returns {Response<T>}
 */
export function response(base, body) {
    return {
        ...base,
        data: body,
        respondAt: Math.floor((new Date).valueOf() / 1000)
    };
}

/**
 * @type {{[code: string]: BaseResponse}}
 */
const ResponseCode = {
    SUCCESS: { success: true, code: "SUCCESS", message: "성공" },
    UNKNOWN_ERROR: { success: false, code: "UNKNOWN_ERROR", message: "알 수 없는 오류가 발생했습니다." },
    NOT_FOUND: { success: false, code: "NOT_FOUND", message: "잘못된 접근입니다." },
    UNAUTHORIZED: { success: false, code: "UNAUTHORIZED", message: "잘못된 인증 정보입니다." }

    // add more response messages here
};
Object.freeze(ResponseCode);

export { ResponseCode };
