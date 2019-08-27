import {BehaviorSubject} from 'rxjs';
import {Injectable, ProvidersMap} from '../../src';
import {HttpClient} from './HttpClient.service';
import {HttpClient2} from './HttpClient2.service';

let i = 0;

export type MyServiceUser = {
  name: string;
}

@Injectable({
  deps: [HttpClient, HttpClient2]
})
export class MyService {
  name = `MyService${++i}`;
  user$: BehaviorSubject<MyServiceUser> = new BehaviorSubject({name: 'MyName'});

  constructor(providers: ProvidersMap<HttpClient>) {
    console.log('MyService', providers);

    setTimeout(() => this.user$.next({name: 'NewName'}), 5000);
    setTimeout(() => this.user$.next(this.user$.getValue()), 7000);
  }
}