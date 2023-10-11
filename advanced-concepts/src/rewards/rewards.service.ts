import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {
  grantTo() {
    console.log('Granting a reward to a coffee...');
  }
}
