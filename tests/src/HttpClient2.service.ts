import {Injectable} from '../../src';
import {Observable} from 'rxjs';


let i = 0;


@Injectable()
export class HttpClient2 {
  name = `HttpClient${++i}`;

  get<T>(): Observable<T> {
    return new Observable();
  }

  post<T>(): Observable<T> {
    return new Observable();
  }
}