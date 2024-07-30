import logger from "@/config/logger";
import parser from "csv-parser";
import { createReadStream } from "fs";

if (!process.env.AREA_CSV_FILE) {
    logger.error("AREA_CSV_FILE is not set.");
    process.exit(1);
}

export async function parseRawAreaCsv() {
    return new Promise((resolve, reject) => {
        const records = [];
        createReadStream(process.env.AREA_CSV_FILE)
            .pipe(parser({ separator: "," }))
            .on("data", data => records.push(data))
            .on("end", () => {
                resolve(records);
            })
            .on("error", e => reject(e));
    });
}

export function filterRemoved(records) {
    return records.filter(record => !record["삭제일자"]);
}

/**
 * @return {{code: string, siDo: string}[]}
 */
function toUniqueSiDo(records) {
    const siDoSet = new Set;
    records.map(record => siDoSet.add(record["시도명"]));

    const siDoArray = Array.from(siDoSet).filter(
        siDo => !siDo.endsWith("자치도")
        && !siDo.endsWith("출장소")
        && !siDo.endsWith("직할시")
        && siDo !== ""
    );

    return siDoArray.map(s => records.find(r => r["시도명"] === s)).map(r => ({ siDo: r["시도명"], code: r["법정동코드"] }));
}

/**
 * @return {{code: string, siDo, string, siGunGu: string}[]}
 */
function toUniqueSiGunGu(records, siDo) {
    return siDo.map(parentSiDo => {
        const siGunGuSet = new Set;
        records.filter(r => r["시도명"] === parentSiDo.siDo).map(r => siGunGuSet.add(r["시군구명"]));

        const siGunGuArray = Array.from(siGunGuSet).filter(siGunGu => !siGunGu.endsWith("출장")
            && siGunGu !== "");

        return siGunGuArray.map(s => records.find(r => r["시군구명"] === s && r["시도명"] === parentSiDo.siDo))
            .map(r => ({ siDo: r["시도명"], siGunGu: r["시군구명"], code: r["법정동코드"] }));
    }).flat();
}

/**
 * @return {{code: string, siDo: string, siGunGu: string, eubMyeonDong: string}[]}
 */
function toUniqueEubMyeonDong(records, siGunGu) {
    return siGunGu.map(parentSiGunGu => {
        const eubMyeonDongSet = new Set;
        records.filter(r => r["시도명"] === parentSiGunGu.siDo && r["시군구명"] === parentSiGunGu.siGunGu)
            .map(r => eubMyeonDongSet.add(r["읍면동명"]));

        const eubMyeonDongArray = Array.from(eubMyeonDongSet).filter(eubMyeonDong => eubMyeonDong !== "");

        return eubMyeonDongArray.map(e => records.find(r => r["읍면동명"] === e && r["시도명"] === parentSiGunGu.siDo && r["시군구명"] === parentSiGunGu.siGunGu))
            .map(r => ({ siDo: r["시도명"], siGunGu: r["시군구명"], eubMyeonDong: r["읍면동명"], code: r["법정동코드"] }));
    }).flat();
}

/**
 * @typedef {import("./types.d").AreaSiDoType} AreaSiDo
 */
/**
 * @return {Readonly<AreaSiDo>[]}
 */
export function parseArea(records) {
    const notRemoved = filterRemoved(records);
    const siDo = toUniqueSiDo(notRemoved);
    const siGunGu = toUniqueSiGunGu(notRemoved, siDo);
    const eubMyeonDong = toUniqueEubMyeonDong(notRemoved, siGunGu);

    siGunGu.map(s => {
        const idx = siDo.findIndex(d => d.siDo === s.siDo);
        if (idx !== -1) {
            if (!siDo[idx].childSiGunGu) {
                siDo[idx].childSiGunGu = [];
            }
            siDo[idx].childSiGunGu.push(s);
        }
    });

    eubMyeonDong.map(e => {
        const siDoIdx = siDo.findIndex(d => d.siDo === e.siDo);
        if (siDoIdx !== -1) {
            const siGunGuIdx = siDo[siDoIdx].childSiGunGu.findIndex(g => g.siGunGu === e.siGunGu);
            if (siGunGuIdx !== -1) {
                if (!siDo[siDoIdx].childSiGunGu[siGunGuIdx].childEubMyeonDong) {
                    siDo[siDoIdx].childSiGunGu[siGunGuIdx].childEubMyeonDong = [];
                }
                siDo[siDoIdx].childSiGunGu[siGunGuIdx].childEubMyeonDong.push(e);
            }
        }
    });

    return Object.freeze(siDo);
}
