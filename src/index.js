import React from 'react';
import { render } from 'react-dom';

import './css/normalize.css';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/container.min.css';
import './css/main.css';

import App from './components/App.jsx';

render(<App />, document.getElementById('root'));
