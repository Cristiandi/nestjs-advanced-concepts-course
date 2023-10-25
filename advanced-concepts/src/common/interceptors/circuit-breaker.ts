import { CallHandler } from '@nestjs/common';
import { tap } from 'rxjs';

const SUCCESS_THRESHOLD = 3; // number of successful operations above which we close the circuit
const FAILURE_THRESHOLD = 3; // number of failed operations above which we open the circuit
const OPEN_TO_HALF_OPEN_WAIT_TIME = 60000; // time to wait before changing the circuit from open to half-open

enum CircuitBreakerState {
  Closed,
  open,
  HalhOpen,
}

export class CircuitBreaker {
  private state = CircuitBreakerState.Closed;
  private failureCount = 0;
  private successCount = 0;
  private lastError: Error;
  private nextAttempt: number;

  exec(next: CallHandler) {
    if (this.state === CircuitBreakerState.open) {
      if (this.nextAttempt > Date.now()) {
        throw this.lastError;
      }
      this.state = CircuitBreakerState.HalhOpen;
    }

    return next.handle().pipe(
      tap({
        next: () => this.handleSuccess(),
        error: (error) => this.handleError(error),
      }),
    );
  }

  private handleSuccess() {
    this.failureCount = 0;
    if (this.state === CircuitBreakerState.HalhOpen) {
      this.successCount++;

      if (this.successCount >= SUCCESS_THRESHOLD) {
        this.successCount = 0;
        this.state = CircuitBreakerState.Closed;
      }
    }
  }

  private handleError(err: Error) {
    this.failureCount++;

    if (
      this.failureCount >= FAILURE_THRESHOLD ||
      this.state === CircuitBreakerState.HalhOpen
    ) {
      this.state = CircuitBreakerState.open;
      this.lastError = err;
      this.nextAttempt = Date.now() + OPEN_TO_HALF_OPEN_WAIT_TIME;
    }
  }
}
