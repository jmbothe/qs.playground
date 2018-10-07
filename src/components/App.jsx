import React, { Component } from 'react';
import update from 'immutability-helper';
import styled from 'styled-components';

export const { Provider, Consumer } = React.createContext();

class App extends Component {
  state = {};

  render() {
    return (
      <Provider
        value={this.state}
      >
       <div>Yo.</div>
      </Provider>
    );
  }
}

export default App;
