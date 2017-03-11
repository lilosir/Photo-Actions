import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/index.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const InitialState = {
	appliedActions: {
		Scale: false,
		Rotate: false,
		Translate: false,
		Opacity: false,
		
	},
	availabledActions: {
		Scale: true,
		Rotate: true,
		Translate: true,
		Opacity: true,
	}
}
//reducer
function myReducer(originalState = InitialState, action) {

	let type = action.type;
	let property = action.property;
	let id = action.id;

	let state = Object.assign({}, originalState);

	switch(type) {
		case 'push':
			if(id === 'appliedActions') {
				state.appliedActions[property] = true;
				state.availabledActions[property] = false;
			} else {
				state.appliedActions[property] = false;
				state.availabledActions[property] = true;
			}
			return state;
		case 'reset':
			return {
				appliedActions: {
					Scale: false,
					Rotate: false,
					Translate: false,
					Opacity: false,
					
				},
				availabledActions: {
					Scale: true,
					Rotate: true,
					Translate: true,
					Opacity: true,
				}
			};
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
