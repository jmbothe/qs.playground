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
        if (!/^{[^]*}$/.test(input)) {
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
        <header>
          <h1>qs Playground</h1>
        </header>
        <Container>
          <p>
            qs is a JavaScript library that stringifies nested object literals
            into url-encoded strings, perfect for sending as query strings in
            HTTP requests. It can also parse such strings back into objects.
            This is just a simple little playground where you can see qs at
            work. This playground might be useful to you if you want to quickly
            generate some qs query strings for prototyping or testing purposes.
          </p>
          <p>
            Express.js uses qs under the hood. So if your backend is an
            Express.js app, you can us qs on the front end to create query
            strings (insert your qs query string immediately after the "?" in
            your request url), and when the request arrives at your backend
            server the query string will be parsed automatically.
          </p>
          <p>
            Find the full qs documentation
{" "}
            <a
              href="https://github.com/ljharb/qs"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>

          <Form>
            <Form.TextArea
              rows="8"
              label="JavaScript Object Literal Input"
              onChange={this.handleChange('objectForm', this.parseObjectInput)}
            />
            <Message negative={!this.state.objectForm.isValid}>
              <Message.Header>Stringified Output</Message.Header>
              {this.state.objectForm.outputValue}
            </Message>
            <Form.TextArea
              rows="8"
              label="qs String Input"
              onChange={this.handleChange('stringForm', this.parseStringInput)}
            />
            <Message negative={!this.state.stringForm.isValid}>
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
