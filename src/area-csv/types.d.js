// typing file for JSDoc.
// do not import this file in js code. only import in JSDoc.

/**
 * @typedef {Object} AreaEubMyeonDong
 * @property {string} code
 * @property {string} siDo
 * @property {string} siGunGu
 * @property {string} eubMyeonDong
 */

/**
 * @type {AreaEubMyeonDong}
 */
export const AreaEubMyeonDongType = {};

/**
 * @typedef {Object} AreaSiGunGu
 * @property {string} code
 * @property {string} siDo
 * @property {string} siGunGu
 * @property {AreaEubMyeonDong[]} childEubMyeonDong
 */

/**
 * @type {AreaSiGunGu}
 */
export const AreaSiGunGuType = {};


/**
 * @typedef {Object} AreaSiDo
 * @property {string} code
 * @property {string} siDo
 * @property {AreaSiGunGu[]} childSiGunGu
 */

/**
 * @type {AreaSiDo}
 */
export const AreaSiDoType = {};
