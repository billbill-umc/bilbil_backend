import {
    getAreaSiDoCount,
    getAreaSiGunGuCount,
    insertAreaEubMyeonDong,
    insertAreaSiDo,
    insertAreaSiGunGu
} from "@/db/area.dao";
import logger from "@/config/logger";

/**
 * @typedef {import("./types.d").AreaSiDoType} AreaData
 */

/**
 * @param {AreaData[]} areaData
 * @return {Promise<void>}
 */
export async function insertAreaToDatabase(areaData) {
    logger.info("Inserting area data to database.");

    logger.info(`Total si/do area: ${areaData.length}`);
    try {
        await insertAreaSiDo(areaData);
    } catch (e) {
        logger.error("Failed to insert si/do area.");
        logger.error(e);

        throw e;
    }


    for (const siDoData of areaData) {
        if (!siDoData.childSiGunGu) continue;

        const parentSiDoCode = siDoData.code;

        logger.info(`Inserting si/gun/gu area for ${siDoData.siDo} (${siDoData.code})`);
        try {
            await insertAreaSiGunGu(siDoData.childSiGunGu.map(({ code, siGunGu }) => ({
                code,
                siGunGu,
                parentSiDoCode
            })));
        } catch (e) {
            logger.error(`Failed to insert si/gun/gu area for ${siDoData.siDo} (${siDoData.code})`);
            logger.error(e);
        }


        for (const siGunGuData of siDoData.childSiGunGu) {
            if (!siGunGuData.childEubMyeonDong) continue;

            const parentSiGunGuCode = siGunGuData.code;

            logger.info(`Inserting eub/myeon/dong area for ${siGunGuData.siGunGu} (${siGunGuData.code}) of ${siDoData.siDo} (${siDoData.code})`);
            try {
                await insertAreaEubMyeonDong(siGunGuData.childEubMyeonDong.map(({ code, eubMyeonDong }) => ({
                    code, eubMyeonDong, parentSiGunGuCode
                })));
            } catch (e) {
                logger.error(`Failed to insert eub/myeon/dong area for ${siGunGuData.siGunGu} (${siGunGuData.code}) of ${siDoData.siDo} (${siDoData.code})`);
                logger.error(e);
            }
        }
    }
}

/**
 * @return {Promise<boolean>}
 */
export async function isAreaDataExist() {
    const siDoCount = await getAreaSiDoCount();
    const siGunGuCount = await getAreaSiGunGuCount();
    const eubMyeonDongCount = await getAreaSiGunGuCount();

    return siDoCount > 3 && siGunGuCount > 3 && eubMyeonDongCount > 3;
}
