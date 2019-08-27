import * as React from 'react';
import {Observable} from 'rxjs';
import {Providable, Subscribable, ProvidersMap} from '../../src'
import {MyService, MyServiceUser} from './MyService.service';


type Props = {
  // From Providable
  providers?: ProvidersMap<MyService>,

  // From Subscribable
  subscribe?: <T>(o: Observable<T>, cb: (value: T) => void) => void,

  test: string;
}

type State = {
  user: MyServiceUser,
}

// @Providable([MyService])
// @Subscribable()
export class MyComponent2 extends React.Component<Props, State> {
  private userService: MyService;

  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
    }

    // this.userService = this.props.providers.get(MyService);
  }

  componentDidMount() {
    const {subscribe} = this.props;

    // subscribe(this.userService.user$, (value) => {
    //   this.setState({user: value});
    // });

    console.log('MyComponent2:MOUNT');
  }

  componentWillUnmount() {
    console.log('MyComponent2:UNMOUNT');
  }
  
  render() {
    console.log('MyComponent2', this.props.providers);

    return (
      <div>
        MyComponent2: {this.props.test} {this.state.user && this.state.user.name}
      </div>
    );
  }
}