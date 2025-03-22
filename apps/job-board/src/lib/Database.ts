import { Module } from '@nestjs/common';
import { Connection, createConnection } from 'mysql2/promise';
class Database implements IDatabase {
  connection!: Connection;

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  async connect() {
    if (this.connection) return;

    this.connection = await createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT as string),
    });
  }

  async disconnect() {
    if (!this.connection) return Promise.resolve();
    return this.connection.end();
  }
}
const db = new Database();

export type DBConnection = Connection;
type IDatabase = {
  connect: () => Promise<void>;
  connection: DBConnection;
  disconnect: () => Promise<void>;
};

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (): Promise<Connection> => {
        await db.connect();
        return db.connection;
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
