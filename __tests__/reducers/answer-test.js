import reducer from '../../src/reducers/answer';
import {
    SET_ANSWER, SET_ANSWERS, SET_CONFIRM_ANSWER
} from '../../src/actions/';

describe('answer reducer', () => {

    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual(
            {
                answers: {},
                confirmAnswers: {}
            }
        );
    });

    it('should handle SET_ANSWER', () => {
        expect(
            reducer(undefined, {
                type: SET_ANSWER,
                payload: {
                    inputRef: 'abc123',
                    answer: 'John Smith'
                }
            })
        ).toEqual(
            {
                answers: {
                    abc123: 'John Smith'
                },
                confirmAnswers: {}
            }
        );

    });

    it('should handle SET_ANSWERS', () => {
        expect(
            reducer(undefined, {
                type: SET_ANSWERS,
                payload: {
                    answers: {
                        abc123: {
                            answer: 'John Smith',
                            was_jumped: false
                        },
                        def456: {
                            answer: 'Jane Smith',
                            was_jumped: false
                        }
                    }
                }
            })
        ).toEqual(
            {
                answers: {
                    abc123: 'John Smith',
                    def456: 'Jane Smith'
                },
                confirmAnswers: {}
            }
        );

    });

    it('should handle SET_CONFIRM_ANSWER', () => {
        expect(
            reducer(undefined, {
                type: SET_CONFIRM_ANSWER,
                payload: {
                    answer: 'John Smith',
                    inputRef: 'abc123'
                }
            })
        ).toEqual(
            {
                answers: {},
                confirmAnswers: {
                    abc123: 'John Smith'
                }
            }
        );

    });
});
