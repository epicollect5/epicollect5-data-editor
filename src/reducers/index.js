import { combineReducers } from 'redux';
import answerReducer from './answer';
import projectReducer from './project';
import formReducer from './form';
import branchReducer from './branch';
import validatorReducer from './validator';
import uploadReducer from './upload';
import generalReducer from './general';
import entryReducer from './entry';
import entryBranchReducer from './entry-branch';
import toastReducer from './toast';

const rootReducer = combineReducers({
    answerReducer,
    projectReducer,
    formReducer,
    branchReducer,
    validatorReducer,
    uploadReducer,
    generalReducer,
    entryReducer,
    entryBranchReducer,
    toastReducer
});

export default rootReducer;
