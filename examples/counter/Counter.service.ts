import {BehaviorSubject} from 'rxjs';
import {Injectable} from '../../src/Injectable';


export enum CounterStatus {
  Started,
  Stopped,
}

export enum CounterDirection {
  Forward = 1,
  Backward = -1
}

export type CounterState = {
  value: number,
  speed: number,
  step: number,
  direction: CounterDirection,
  status: CounterStatus,
}

const initialState: CounterState = {
  value: 0,
  speed: 1000,
  step: 1,
  direction: CounterDirection.Forward,
  status: CounterStatus.Stopped,
};

@Injectable()
export class CounterService {
  state$: BehaviorSubject<CounterState> = new BehaviorSubject(initialState);

  private timeout: number | null = null;

  private tick() {
    this.timeout = setTimeout(() => {
      const state = this.state$.getValue();
      this.state$.next({
        ...state,
        value: state.value + state.direction,
      });
      this.tick();
    }, this.state$.getValue().speed) as any as number;
  }

  start() {
    if (this.timeout) {
      return;
    }

    this.state$.next({
      ...this.state$.getValue(),
      status: CounterStatus.Started,
    });

    this.tick();
  }

  stop() {
    if (!this.timeout) {
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = null;

    this.state$.next({
      ...this.state$.getValue(),
      status: CounterStatus.Stopped,
    });
  }

  restart() {
    if (!this.timeout) {
      return;
    }
    this.stop();
    this.start();
  }

  reset() {
    if (this.timeout) {
      this.stop();
    }
    this.state$.next(initialState);
  }

  setValue(value: number) {
    this.state$.next({
      ...this.state$.getValue(),
      value,
    });
  }

  setSpeed(value: number) {
    this.state$.next({
      ...this.state$.getValue(),
      speed: value,
    });
  }

  setDirection(value: CounterDirection) {
    this.state$.next({
      ...this.state$.getValue(),
      direction: value,
    });
  }
}