import { Pool } from 'pg';

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

    public static async addUser(db: Pool, username: string, email: string, password: string) {
        return this.add(db, 'users', ['username', 'email', 'password', 'created_on'], [username, email, password, new Date()]);
    }

    public static async findUsers(db: Pool, username: string, email: string) {
        const { rows } = await db.query(/* sql */`
            SELECT * FROM users WHERE (LOWER(username)=LOWER($1)) OR (LOWER(email)=LOWER($2)) 
        `, [username, email]);
        return rows;
    }
}

export { DBQueries };