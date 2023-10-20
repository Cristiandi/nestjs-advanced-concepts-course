import { IntervalHost } from '../scheduler/decorators/interval-host.decorator';
import { Interval } from '../scheduler/decorators/interval.decorator';

@IntervalHost
export class CronService {
  // uncomment this to execute the scheduler functionality
  @Interval(1000)
  everySecond() {
    console.log('this will be called every second');
  }
}
