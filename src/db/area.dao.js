import { getQueryBuilder } from "@/config/db";

/**
 * @typedef {import("../area-csv/types.d").AreaSiDoType} AreaSiDo
 * @typedef {import("../area-csv/types.d").AreaSiGunGuType} AreaSiGunGu
 * @typedef {import("../area-csv/types.d").AreaEubMyeonDongType} AreaEubMyeonDong
 */

/**
 * insert si/do area to database
 * @param {AreaSiDo[]} siDo
 * @return {Promise<void>}
 */
export async function insertAreaSiDo(siDo) {
    await getQueryBuilder()("areaSiDo").insert(
        siDo.map(({ code, siDo }) => ({ code, name: siDo }))
    );
}

/**
 * get list of si/do area from database
 * @return {Promise<{id: number, code: number, name: string}[]>}
 */
export async function getAreaSiDoList() {
    return getQueryBuilder()("areaSiDo").select("*");
}

/**
 * @return {Promise<number>}
 */
export async function getAreaSiDoCount() {
    const c = await getQueryBuilder()("areaSiDo").count("* as count")
        .first();

    return c.count;
}

/**
 * insert si/gun/gu area to database
 * @param {(AreaSiGunGu & { parentSiDoCode: number })[]} siGunGu
 * @return {Promise<void>}
 */
export async function insertAreaSiGunGu(siGunGu) {
    await getQueryBuilder()("areaSiGunGu").insert(
        siGunGu.map(({ code, parentSiDoCode, siGunGu }) => ({
            code,
            siDoCode: parentSiDoCode,
            name: siGunGu
        }))
    );
}

/**
 * get list of si/gun/gu area from database
 * @return {Promise<{id: number, siDoCode: number, code: number, name: string}[]>}
 */
export async function getAreaSiGunGuList() {
    return getQueryBuilder()("areaSiGunGu").select("*");
}

/**
 * @return {Promise<number>}
 */
export async function getAreaSiGunGuCount() {
    const c = await getQueryBuilder()("areaSiGunGu").count("* as count")
        .first();

    return c.count;
}

/**
 * insert eub/myeon/dong area to database
 * @param {(AreaEubMyeonDong & { parentSiGunGuCode: number })[]} eubMyeonDong
 * @return {Promise<void>}
 */
export async function insertAreaEubMyeonDong(eubMyeonDong) {
    await getQueryBuilder()("areaEubMyeonDong").insert(
        eubMyeonDong.map(({ code, parentSiGunGuCode, eubMyeonDong }) => ({
            code,
            siGunGuCode: parentSiGunGuCode,
            name: eubMyeonDong
        }))
    );
}

/**
 * get list of eub/myeon/dong area from database
 * @return {Promise<{id: number, siGunGuCode: number, code: number, name: string}[]>}
 */
export async function getAreaEubMyeonDongList() {
    return getQueryBuilder()("areaEubMyeonDong").select("*");
}

/**
 * @return {Promise<number>}
 */
export async function getAreaEubMyeonDongCount() {
    const c = await getQueryBuilder()("areaEubMyeonDong").count("* as count")
        .first();

    return c.count;
}
