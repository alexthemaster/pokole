import { Pool } from "pg";

class DBQueries {
    constructor() {
        throw new Error("This class cannot be initiated.");
    }

    public static async add(db: Pool, table: string, columns: string[], values: any[]) {
        const expressions: string[] = [];

        for (let i = 0; i < values.length; i++) {
            expressions.push(`$${i + 1}`)
        };

        return await db.query(/* sql */`
            INSERT INTO ${table} (${columns.join(',')}) VALUES (${expressions.join(',')})
        `, [...values])
    }

    public static async exists(db: Pool, table: string, column: string, value: any): Promise<boolean> {
        const { rows } = await db.query(/* sql */`
            SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column}=$1)
        `, [value]);
        return rows[0].exists;
    }

    public static async find(db: Pool, table: string, column: string, value: any) {
        return await db.query(/* sql */`
            SELECT * FROM ${table} WHERE ${column}=$1
        `, [value]);
    }
}

export { DBQueries };