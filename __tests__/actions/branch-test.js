import * as branchActions from '../../src/actions/branch';
import * as consts from '../../src/actions/';

describe('answer actions', () => {

    it('should set up a branch add', () => {

        const expectedAction = {
            type: consts.SET_UP_BRANCH_ADD,
            payload: {
                currentInputRef: 'abc',
                currentInputIndex: 0
            }
        };
        expect(branchActions.branchAdd({ currentInputRef: 'abc', currentInputIndex: 0 })).toEqual(expectedAction);
    });

    it('should set up a branch edit', () => {

        const expectedAction = {
            type: consts.SET_UP_BRANCH_EDIT,
            payload: {
                currentInputRef: 'abc',
                currentInputIndex: 0
            }
        };
        expect(branchActions.branchEdit({ currentInputRef: 'abc', currentInputIndex: 0 })).toEqual(expectedAction);
    });

    it('should reset a branch', () => {

        const expectedAction = {
            type: consts.RESET_BRANCH,
            payload: {}
        };
        expect(branchActions.reset()).toEqual(expectedAction);
    });

});
