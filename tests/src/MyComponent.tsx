import * as React from 'react';
import {MyService} from './MyService.service';
import {Providable} from '../../src';
import {ProvidersMap} from '../../src/Providable';
import {MyComponent2} from './MyComponent2';


type Props = {
  providers?: ProvidersMap<MyService>,
  test: string,
}


@Providable([MyService])
export class MyComponent extends React.Component<Props> {
  render() {
    return (
      <div>
        MyComponent: {this.props.test}
        <MyComponent2 test={this.props.test} />
      </div>
    );
  }
}