import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import App from './App';
import './index.css';
import { rootEpic, rootReducer } from './module'
import registerServiceWorker from './registerServiceWorker';


const epicMiddleware = createEpicMiddleware();
const configureStore = () => {
  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(epicMiddleware)));
  epicMiddleware.run(rootEpic);
  return store;
}

ReactDOM.render(
  <Provider store={configureStore()}><App /></Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
