/**
 * @typedef {Object} BaseResponse
 * @property {boolean} success
 * @property {string} code
 * @property {string} message
 */

/**
 * BaseResponse type placeholder. do not import in js code.
 * @type {BaseResponse}
 */
export const BaseResponseType = {};

/**
 * @typedef {Object} Response<T>
 *     @extends BaseResponse
 * @template T
 * @property {T} data
 */
/**
 * Response type placeholder. do not import in js code.
 * @type {Response<unknown>}
 */
export const ResponseType = {};

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
    UNAUTHORIZED: { success: false, code: "UNAUTHORIZED", message: "잘못된 인증 정보입니다." },

    // chattings
    INVALID_CHAT_ID: { success: false, code: "INVALID_CHAT_ID", message: "잘못된 채팅 ID 입니다." },

    // notifications
    INVALID_NOTIFICATION_ID: { success: false, code: "INVALID_NOTIFICATION_ID", message: "잘못된 알림 ID 입니다." },

    // posts
    INVALID_POST_ID: { success: false, code: "INVALID_POST_ID", message: "잘못된 게시글 ID 입니다." },
    INVALID_POST_DATA: { success: false, code: "INVALID_POST_DATA", message: "잘못된 게시글 데이터 입니다." }

    // add more response messages here
};
Object.freeze(ResponseCode);

export { ResponseCode };
