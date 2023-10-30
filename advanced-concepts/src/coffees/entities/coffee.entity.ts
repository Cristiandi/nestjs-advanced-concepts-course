import { WithUuid } from '../../common/mixins/with-uuid.mixin/with-uuid.mixin';

export class Coffee {
  constructor(public name: string) {}
}

const CoffeeWithUuidCls = WithUuid(Coffee);
const coffee = new CoffeeWithUuidCls('Black Coffee');
