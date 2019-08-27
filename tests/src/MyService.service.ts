import {BehaviorSubject} from 'rxjs';
import {Injectable} from '../../src';

let i = 0;

export type MyServiceUser = {
  name: string;
}

@Injectable()
export class MyService {
  name = `id${++i}`;
  user$: BehaviorSubject<MyServiceUser> = new BehaviorSubject({name: 'MyName'});

  constructor() {
    setTimeout(() => this.user$.next({name: 'NewName'}), 5000);
    setTimeout(() => this.user$.next(this.user$.getValue()), 7000);
  }
}