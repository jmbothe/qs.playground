import React, { Component } from 'react';
import { createContext, runInNewContext } from 'vm';
import { stringify, parse } from 'qs';
import { inspect } from 'util';
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
      isValid: true,
      outputValue: '',
    },
  };

  parseObjectInput = debounce(() => {
    this.setState(prevState => {
      const input = prevState.objectForm.inputValue;
      try {
        if (!/^{.*}$/.test(input)) {
          throw new Error('Invalid JavaScript template literal.');
        }
        runInNewContext(`output = stringify(${input})`, context);

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
            isValid: !input,
            outputValue: input ? err.message : '',
          },
        };
      }
    });
  }, 150);

  parseStringInput = debounce(() => {
    this.setState(prevState => {
      const input = prevState.stringForm.inputValue;
      try {
        const output = inspect(parse(input), { depth: 10, compact: false });

        return {
          ...prevState,
          stringForm: {
            ...prevState.stringForm,
            isValid: true,
            outputValue: input ? output : '',
          },
        };
      } catch (err) {
        return {
          ...prevState,
          stringForm: {
            ...prevState.stringForm,
            isValid: !input,
            outputValue: input ? err.message : '',
          },
        };
      }
    });
  }, 150);

  handleChange = (formName, cb) => e => {
    e.preventDefault();
    e.persist();
    this.setState(prevState => ({
      ...prevState,
      [formName]: {
        ...prevState[formName],
        inputValue: e.target.value,
      },
    }));

    cb();
  };

  render() {
    return (
      <Provider value={this.state}>
        <Container>
          <Form>
            <Form.TextArea
              label="JavaScript Object Literal Input"
              onChange={this.handleChange('objectForm', this.parseObjectInput)}
            />
            <Message>
              <Message.Header>Stringified Output</Message.Header>
              {this.state.objectForm.outputValue}
            </Message>
            <Form.TextArea
              label="qs String Input"
              onChange={this.handleChange('stringForm', this.parseStringInput)}
            />
            <Message>
              <Message.Header>Object Literal Output</Message.Header>
              {this.state.stringForm.outputValue}
            </Message>
          </Form>
        </Container>
      </Provider>
    );
  }
}

export default App;
