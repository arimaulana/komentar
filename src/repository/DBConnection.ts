export interface DBConnection {
    getConnection(): any;
    getRepository(model: any): any;
}