import { Coffee } from './entities/coffee.entity';

// BEST PRACTICE: define a token for a custom provider / dependency
export const COFFEES_DATA_SOURCE = Symbol('COFFEES_DATA_SOURCE');

// OR alternatively "export type CoffeesDataSource = Coffee[];"
export interface CoffeesDataSource {
  [index: number]: Coffee;
}