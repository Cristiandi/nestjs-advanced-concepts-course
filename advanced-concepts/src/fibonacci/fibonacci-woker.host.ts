import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { Observable, filter, firstValueFrom, fromEvent, map } from 'rxjs';
import { Worker } from 'worker_threads';

@Injectable()
export class FibonacciWorkerHost
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private worker: Worker;
  private message$: Observable<{ id: string; result: number }>;

  onApplicationBootstrap() {
    this.worker = new Worker(join(__dirname, 'fibonacci.worker.js'));
    this.message$ = fromEvent(this.worker, 'message') as any;
  }
  onApplicationShutdown(signal?: string) {
    this.worker.terminate();
  }

  run(n: number) {
    const uniqueId = randomUUID();
    this.worker.postMessage({ n, id: uniqueId });

    return firstValueFrom(
      // convert out Observable to a Promise
      this.message$.pipe(
        // filter out messages by IDs
        filter(({ id }) => id === uniqueId),
        // pluck the result value
        map(({ result }) => result),
      ),
    );
  }
}
