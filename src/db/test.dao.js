import { getDatabase } from "@/config/db";
import { testSql } from "@/model/sql/test";


export async function getTest() {
    const db = await getDatabase().getConnection();
    const result = await db.query(testSql);
    db.release();

    return result;
}
