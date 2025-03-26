import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MESSAGE_CLIENT } from './constants';

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          imports: [ConfigModule],
          name: MESSAGE_CLIENT,
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [configService.get('KAFKA_BROKER') as string],
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
