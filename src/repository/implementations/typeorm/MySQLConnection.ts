import { Connection, ConnectionOptions, createConnection, Repository, EntitySchema } from "typeorm";
import { Inject } from "@nestjs/common";
import { DBConnection } from "../../DBConnection";

export class MySQLConnection implements DBConnection {

    private static connection: Connection;

    private constructor(@Inject("CONNECTION") connection: Connection) {
        MySQLConnection.connection = connection;
    }

    public static async createConnection(option: ConnectionOptions): Promise<Connection> {
        MySQLConnection.connection = await createConnection(option);
        return MySQLConnection.connection;
    }

    public getConnection(): Connection {
        return MySQLConnection.connection;
    }

    public getRepository(model: any): Repository<any> {
        return MySQLConnection.connection.getRepository(model);
    }
}
