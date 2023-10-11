import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';

// BEST PRACTICE: define a token for a custom provider / dependency
export const COFFEES_DATA_SOURCE = Symbol('COFFEES_DATA_SOURCE');

@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService, { provide: COFFEES_DATA_SOURCE, useValue: [] }],
})
export class CoffeesModule {}
