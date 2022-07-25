import {
    SET_ANSWER, SET_CONFIRM_ANSWER, RESET_BRANCH_ANSWERS, RESET_CONFIRM_ANSWERS, SET_ANSWERS, RESET_APP
} from '../actions/';
import parameters from '../constants/parameters';

const initialState = {
    answers: {},
    confirmAnswers: {}
};

const answerReducer = (state = initialState, action) => {

    const payload = action.payload;
    const answers = Object.assign({}, state.answers);
    const confirmAnswers = Object.assign({}, state.confirmAnswers);

    switch (action.type) {

        case SET_ANSWER:
            answers[payload.inputRef] = payload.answer;

            // Check if this is a jump input and whether the answer has changed

            return Object.assign({}, state, {
                answers
            });
        case SET_ANSWERS:

            // Load the existing answers
            // Note: answers are objects, so need to pull
            // out the 'answer' part
            Object.keys(payload.answers).forEach((key) => {
                const obj = payload.answers[key];
                answers[key] = obj.answer;
            });

            return Object.assign({}, state, {
                answers
            });
        case SET_CONFIRM_ANSWER:
            confirmAnswers[payload.inputRef] = payload.answer;
            return Object.assign({}, state, {
                confirmAnswers
            });
        case RESET_BRANCH_ANSWERS: {

            // Get all the branch input refs to clear
            const branchInputRefs = payload.project.getFormBranches(payload.formRef)[payload.ownerInputRef];

            // Loop each answer and remove
            branchInputRefs.forEach((inputRef) => {
                const input = payload.project.getInput(inputRef);
                // If we have a group within a branch
                if (input.type === parameters.GROUP) {
                    // Loop each group answer and remove
                    const branchGroupInputRefs = payload.project.getGroupInputs(payload.formRef, inputRef);
                    branchGroupInputRefs.forEach((groupInput) => {
                        delete answers[groupInput.ref];
                    });
                }
                delete answers[inputRef];
            });
            return Object.assign({}, state, {
                answers
            });
        }
        case RESET_CONFIRM_ANSWERS:
            return Object.assign({}, state, {
                confirmAnswers: {}
            });
        case RESET_APP: {
            // Perform deep clone of the initialState object
            return JSON.parse(JSON.stringify(initialState));
        }
        default:
            return state;
    }
};

export default answerReducer;
