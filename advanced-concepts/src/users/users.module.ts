import { Module } from '@nestjs/common';

import { DataSourceModule } from '../data-source/data-source.module';

import { UsersService } from './users.service';

import { UsersController } from './users.controller';

@Module({
  imports: [DataSourceModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
