import React, { Component } from 'react';
import update from 'immutability-helper';
import styled from 'styled-components';
import { createContext, runInNewContext } from 'vm';
import { stringify } from 'qs';
import debounce from 'lodash.debounce';
import { Form, Message, Container } from 'semantic-ui-react';

export const { Provider, Consumer } = React.createContext();

const context = {
  stringify,
  output: '',
};
createContext(context);

class App extends Component {
  state = {
    objectForm: {
      inputValue: '',
      isValid: true,
      outputValue: '',
    },
    stringForm: {
      inputValue: '',
      outputValue: '',
    },
  };

  parseObjectInput = debounce(() => {
    this.setState(prevState => {
      try {
        runInNewContext(
          `output = stringify(${prevState.objectForm.inputValue})`,
          context,
        );

        return {
          ...prevState,
          objectForm: {
            ...prevState.objectForm,
            isValid: true,
            outputValue: context.output,
          },
        };
      } catch (err) {
        return {
          ...prevState,
          objectForm: {
            ...prevState.objectForm,
            isValid: false,
            outputValue: err.message,
          },
        };
      }
    });
  }, 300);

  handleChange = e => {
    e.preventDefault();
    e.persist();
    this.setState(prevState => ({
      ...prevState,
      objectForm: {
        ...prevState.objectForm,
        inputValue: e.target.value,
      },
    }));

    this.parseObjectInput();
  };

  render() {
    return (
      <Provider value={this.state}>
        <Container>
          <Form>
            <Form.TextArea
              label="Object Literal Input"
              onChange={this.handleChange}
            />
            <Message>
              <Message.Header>Stringified Output</Message.Header>
              {this.state.objectForm.outputValue}
            </Message>
          </Form>
          <Form>
            <Form.TextArea label="qs String Input" />
            <Message>
              <Message.Header>Object Literal Output</Message.Header>
            </Message>
          </Form>
        </Container>
      </Provider>
    );
  }
}

export default App;
