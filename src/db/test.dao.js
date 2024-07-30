import { getDatabase } from "@/config/db";
import { testSql } from "@/model/sql/example";


export async function getTest() {
    const db = await getDatabase().getConnection();
    const result = await db.query(testSql);
    db.release();

    return result;
}
