import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';

export function EntityExistsPipe(entityCls: Type): Type<PipeTransform> {
  @Injectable()
  class EntityExistsPipeCls implements PipeTransform {
    constructor(
      @Inject(entityCls)
      private entityRepository: { exists(condition: unknown): Promise<void> },
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
      await this.entityRepository.exists({ where: { id: value } }); // throws if entity doesn't exists
      return value;
    }
  }

  return EntityExistsPipeCls;
}
