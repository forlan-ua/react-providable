import * as React from 'react';
import * as ReactDom from 'react-dom';
import {MyComponent} from './MyComponent';


type State = {
  show: boolean,
}


class Test extends React.Component<{}, State> {
  time: number = Date.now();

  constructor(props: {}) {
    super(props);

    this.state = {
      show: false,
    }
  }

  componentDidMount() {
    let i = 0;
    const interval = setInterval(() => {
      if (++i === 10) {
        clearInterval(interval);
        return;
      }

      this.time = Date.now();
      this.forceUpdate();
    }, 1500);
  }

  render() {
    console.log('RENDER');
    return (
      <div>
        <button onClick={() => this.setState({show: !this.state.show})}>{this.state.show ? 'HIDE' : 'SHOW'}</button>
        {this.state.show && <MyComponent test={this.time.toString()} />}
      </div>
    )
  }
}


ReactDom.render(
  <Test />,
  document.getElementById('react-root'),
);