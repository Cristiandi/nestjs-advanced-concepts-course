import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './recipes.module-definition';

@Module({})
export class RecipesModule extends ConfigurableModuleClass {}
