import { Module } from '@nestjs/common';

import { COFFEES_DATA_SOURCE } from './coffees.datasource';

import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService, { provide: COFFEES_DATA_SOURCE, useValue: [] }],
})
export class CoffeesModule {}
