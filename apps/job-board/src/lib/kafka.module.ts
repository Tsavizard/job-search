import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MESSAGE_CLIENT } from './constants';

@Module({
  imports: [
    ClientsModule.register({
      clients: [{ name: MESSAGE_CLIENT, transport: Transport.KAFKA }],
      isGlobal: true,
    }),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
