import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';

import { INTERVAL_HOST_KEY } from '../decorators/interval-host.decorator';
import { INTERVAL_KEY } from '../decorators/interval.decorator';

@Injectable()
export class IntervalScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly intervals: NodeJS.Timeout[] = [];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders(); // get all providers

    providers.forEach((wrapper) => {
      const { instance } = wrapper;

      const prototype = instance && Object.getPrototypeOf(instance);

      // this filter is useful to avoid value and factory providers as well
      if (!instance || !prototype) {
        return;
      }

      const isIntervalHost =
        this.reflector.get<boolean>(INTERVAL_HOST_KEY, instance.constructor) ??
        false;

      if (!isIntervalHost) return;

      const methodKeys = this.metadataScanner.getAllMethodNames(prototype);

      methodKeys.forEach((methodKey) => {
        const interval = this.reflector.get<number>(
          INTERVAL_KEY,
          instance[methodKey],
        );

        if (interval === undefined) return; // this helps exclude methods that are not annotated with @Interval decorator

        const intervalRef = setInterval(() => instance[methodKey](), interval);

        this.intervals.push(intervalRef);
      });
    });
  }

  onApplicationShutdown(signal?: string) {
    this.intervals.forEach((intervalRef) => clearInterval(intervalRef));
  }
}
