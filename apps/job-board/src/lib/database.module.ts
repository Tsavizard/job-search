import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection, createConnection } from 'mysql2/promise';
class Database implements IDatabase {
  connection!: Connection;

  constructor(private configService: ConfigService) {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  async connect() {
    this.connection ||= await createConnection({
      host: this.configService.get('MYSQL_HOST'),
      user: this.configService.get('MYSQL_USER'),
      password: this.configService.get('MYSQL_PASSWORD'),
      database: this.configService.get('MYSQL_DATABASE'),
      port: this.configService.get('MYSQL_PORT'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async disconnect() {
    if (!this.connection) return Promise.resolve();
    return this.connection.end();
  }
}

export type DBConnection = Connection;
type IDatabase = {
  connect: () => Promise<void>;
  connection: DBConnection;
  disconnect: () => Promise<void>;
};

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService): Promise<Connection> => {
        const db = new Database(configService);
        await db.connect();
        return db.connection;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
