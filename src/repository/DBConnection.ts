export interface DBConnection {
    // createConnection(option: any): Promise<void>;
    getConnection(): any;
    getRepository(model: any): any;
}