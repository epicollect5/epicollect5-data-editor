import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
//import createLogger from 'redux-logger';
//import freezeState from 'redux-freeze-state';
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from '../reducers';

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        //freezeState(rootReducer),
        preloadedState,
        applyMiddleware(
            promiseMiddleware(),
            thunkMiddleware,
            //createLogger()
        )
    );
}

