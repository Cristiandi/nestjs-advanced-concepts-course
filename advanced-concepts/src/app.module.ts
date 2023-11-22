import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ContextIdFactory } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { CronModule } from './cron/cron.module';
import { FibonacciModule } from './fibonacci/fibonacci.module';
import { HttpClientModuleModule } from './http-client-module/http-client-module.module';
import { RecipesModule } from './recipes/recipes.module';
import { TagsModule } from './tags/tags.module';
import { PaymentsModule } from './payments/payments.module';
import { DataSourceModule } from './data-source/data-source.module';
import { UsersModule } from './users/users.module';
import { I18nModule } from './i18n/i18n.module';

// import { AggregateByTenantContextIdStrategy } from './core/aggregate-by-tenant.strategy';
import { AggregateByLocaleContextIdStrategy } from './core/aggregate-by-locale.strategy';

ContextIdFactory.apply(new AggregateByLocaleContextIdStrategy());

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CoffeesModule,
    SchedulerModule,
    CronModule,
    FibonacciModule,
    HttpClientModuleModule.register({
      baseUrl: 'http://localhost:3000',
    }),
    RecipesModule,
    TagsModule,
    PaymentsModule,
    DataSourceModule,
    UsersModule,
    I18nModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
