import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseInterceptors,
  RequestTimeoutException,
} from '@nestjs/common';

import { COFFEES_DATA_SOURCE, CoffeesDataSource } from './coffees.datasource';

import { CircuitBreakerInterceptor } from '../common/interceptors/circuit-breaker.interceptor';
// import { EntityExistsPipe } from '../common/pipe/entity-exists/entity-exists.pipe';

// import { Coffee } from './entities/coffee.entity';

import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@UseInterceptors(CircuitBreakerInterceptor)
@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService, // implicit dependency injection
    @Inject(COFFEES_DATA_SOURCE)
    private readonly coffeesDataSource: CoffeesDataSource, // explicit dependency injection
  ) {}

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Get()
  findAll() {
    console.log('Finding all coffees...');
    throw new RequestTimeoutException();
    // return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    // @Param('id', EntityExistsPipe(Coffee)) id: string,
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(+id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(+id);
  }
}
