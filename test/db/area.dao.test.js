import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { getDatabase, initDatabase } from "@/config/db";
import { getAreaSiDoList, insertAreaSiDo } from "@/db/area.dao";

describe("Area DAO tests", () => {
    beforeAll(async () => {
        await import("@/env");
        await initDatabase();
    });

    test("area.dao.js :: siDo", async () => {
        expect.assertions(1);

        await insertAreaSiDo([ {
            code: 1234,
            siDo: "테스트 시/도 1"
        } ]);

        const list = await getAreaSiDoList();

        console.log(list);

        expect(list).toHaveLength(1);
    });

    afterAll(async () => {
        await getDatabase().close();
    });
});
