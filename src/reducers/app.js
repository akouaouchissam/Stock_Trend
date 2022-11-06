import {Map} from 'immutable';
import stock from './stock';
import auth from './auth';

export const combineReducers = reducers => {
  return (state=Map(), action) => {
    for (let stateKey in reducers) {
      if (state.has(stateKey)) {
        let oldState = state.get(stateKey);
        let newState = reducers[stateKey](oldState, action);
        if (newState !== oldState) {
          state = state.set(stateKey, newState);
        }
      } else {
        state = state.set(stateKey, reducers[stateKey](undefined, action));
      }
    }

    return state;
  };
};

export default combineReducers({
  stock,
  auth
});
