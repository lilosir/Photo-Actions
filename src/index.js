import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/index.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const InitialState = {
	appliedActions: {
		scale: true
	},
	availabledActions: {
		
	}
}
//reducer
function myReducer(state = InitialState, action) {

	let type = action.type;
	let property = action.property;
	switch(type) {
		case 'push':
			return Object.assign(state, {
				property: true
			});
		case 'remove':
			return delete state.property;
		case 'reset': 
			return state = {};
		default: 
			return state;
	}
}
// Store
const store = createStore(myReducer);

ReactDOM.render(
	<Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
);
