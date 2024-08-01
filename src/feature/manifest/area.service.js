import { getAreaManifestFromCache, setAreaManifestToCache } from "@/cache/area-manifest";
import { getAreaEubMyeonDongList, getAreaSiDoList, getAreaSiGunGuList } from "@/db/area.dao";
import { response, ResponseCode } from "@/config/response";
import logger from "@/config/logger";

export async function GetAreaManifestService() {
    let manifest = await getAreaManifestFromCache();

    if (!manifest) {
        logger.info("Area manifest not found in cache, generating new one from database.");

        // fetch area data from database
        const siDoList = (await getAreaSiDoList()).map(({ code, name }) => ({ code, name }));
        const siGunGuList = await getAreaSiGunGuList();
        const eubMyeonDongList = await getAreaEubMyeonDongList();

        // generate area manifest
        for (const siDo of siDoList) {
            const currentSiDoChild = siGunGuList
                .filter(siGunGu => siGunGu.siDoCode === siDo.code)
                .map(({ code, name }) => ({ code, name }));

            for (const siGunGu of currentSiDoChild) {
                siGunGu.childArea = eubMyeonDongList
                    .filter(eubMyeonDong => eubMyeonDong.siGunGuCode === siGunGu.code)
                    .map(({ code, name }) => ({ code, name }));
            }

            siDo.childArea = currentSiDoChild;
        }

        // get manifest version from csv file name
        const rawCsvFilePath = process.env.AREA_CSV_FILE.split("/");
        const manifestVersion = rawCsvFilePath[rawCsvFilePath.length - 1].replaceAll(".csv", "");

        manifest = {
            version: manifestVersion,
            area: siDoList
        };

        await setAreaManifestToCache(manifest);
    }

    return response(ResponseCode.SUCCESS, manifest);
}
