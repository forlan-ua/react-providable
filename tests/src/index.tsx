import * as React from 'react';
import * as ReactDom from 'react-dom';
import {MyComponent} from './MyComponent';


type State = {
  show: boolean,
}

const ThemeContext = React.createContext('light');
const UserContext = React.createContext({name: 'Guest'});


class Test2 extends React.Component<any> {
  render() {
    return (
      <div>
        <ThemeContext.Provider value={'dark'}>
          <UserContext.Provider value={{name: 'dsa'}}>
            <ThemeContext.Consumer>
              {theme => (
                <UserContext.Consumer>
                  {user => (
                    <>
                      <div>{theme} {user.name}</div>
                    </>
                  )}
                </UserContext.Consumer>
              )}
            </ThemeContext.Consumer>
          </UserContext.Provider>
      </ThemeContext.Provider>
      </div>
    );
  }
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
    setInterval(() => {
      this.time = Date.now();
      this.forceUpdate();
    }, 5000);
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