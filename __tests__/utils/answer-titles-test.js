import Answers from '../../src/utils/Answers';

describe('answer utils titles test', () => {

    // Titles have proved to be the source of bugs at times
    // Here is a list of likely causes for bugs:
    // - titles on checkbox input
    // - group input titles
    // - empty/no titles

    /**
     * Create in input
     *
     * @param type
     * @param ref
     * @param isTitle
     * @param possibleAnswers
     * @param group
     * @returns {{max: null, min: null, ref: *, type: *, group: Array, jumps: Array, regex: null, branch: Array, verify: boolean, default: null, is_title: boolean, question: string, uniqueness: string, is_required: boolean, datetime_format: null, possible_answers: Array, set_to_current_datetime: boolean}}
     */
    function getInput(type, ref, isTitle = false, possibleAnswers = [], group = []) {
        return {
            "max": null,
            "min": null,
            "ref": ref,
            "type": type,
            "group": group,
            "jumps": [],
            "regex": null,
            "branch": [],
            "verify": false,
            "default": null,
            "is_title": isTitle,
            "question": "A Question",
            "uniqueness": "none",
            "is_required": true,
            "datetime_format": null,
            "possible_answers": possibleAnswers,
            "set_to_current_datetime": false
        };
    }

    it('titles should be empty: no title set, with answer', () => {
        const answersUtil = new Answers();
        // Input ref and input
        const inputRef = 'xxx';
        const input = getInput('text', inputRef);

        // List of input refs
        const inputs = [inputRef];

        // List of inputs - just one input
        const inputList = { xxx: { data: input } };

        // Empty entry object
        const entry = {};

        // Supply answer for the input
        entry.answers = {};
        entry.answers[inputRef] = { answer: 'hello' };

        // No group needed
        const group = {};

        // Expect that we receive an empty titles array, because there is no title set
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual([]);
    });

    it('titles should be empty: no title set, without answer', () => {
        const answersUtil = new Answers();
        // Input ref and input
        const inputRef = 'xxx';
        const input = getInput('text', inputRef);

        // List of input refs
        const inputs = [inputRef];

        // List of inputs - just one input
        const inputList = { xxx: { data: input } };

        // Empty entry object
        const entry = {};

        // Empty answer for the input
        entry.answers = {};
        entry.answers[inputRef] = { answer: '' };

        // No group needed
        const group = {};

        // Expect that we receive an empty titles array, because there is no title set
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual([]);
    });

    it('titles should be empty: title set, checkbox input, without answer', () => {
        const answersUtil = new Answers();
        // Input ref and input
        const inputRef = 'xxx';
        const input = getInput('checkbox', inputRef, true);

        // List of input refs
        const inputs = [inputRef];

        // List of inputs - just one input
        const inputList = { xxx: { data: input } };

        // Empty entry object
        const entry = {};

        // Empty answer for the checkbox input
        entry.answers = {};
        entry.answers[inputRef] = { answer: [] };

        // No group needed
        const group = {};

        // Expect that we receive an empty titles array, because the checkbox input has no answer
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual([]);
    });

    it('titles should be array with one csv value "yes, no": title set, checkbox input, with answer', () => {
        const answersUtil = new Answers();
        // Input ref and input
        const inputRef = 'xxx';
        const input = getInput('checkbox', inputRef, true,
            [
                {
                    "answer": "yes",
                    "answer_ref": "a"
                },
                {
                    "answer": "no",
                    "answer_ref": "b"
                }
            ]
        );

        // List of input refs
        const inputs = [inputRef];

        // List of inputs - just one input
        const inputList = { xxx: { data: input } };

        // Empty entry object
        const entry = {};

        // Answer given for the checkbox input
        entry.answers = {};
        entry.answers[inputRef] = { answer: ['a', 'b'] };

        // No group needed
        const group = {};

        // Expect that we receive a titles array with ['yes, no'] as only element
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual(['yes, no']);
    });


    /**
     * Groups
     */

    it('group titles should be empty: no title set, with answer', () => {
        const answersUtil = new Answers();
        // Empty entry object
        const entry = {};

        // Input ref and input
        const inputRef = 'xxx';
        const input = getInput('text', inputRef);

        // Supply answer for the input
        entry.answers = {};
        entry.answers[inputRef] = { answer: 'hello' };

        // Group input ref and input
        const groupInputRef = 'ggg_xxx';
        // Group
        const group = {
            [groupInputRef]: [
                inputRef
            ]
        };

        const groupInput = getInput('group', groupInputRef, false, [], group);

        // List of top level input refs
        const inputs = [groupInputRef];

        // List of inputs
        const inputList = {
            [groupInputRef]: { data: groupInput },
            [inputRef]: { data: input },
        };


        // Expect that we receive an empty titles array, because there is no title set
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual([]);
    });

    it('group titles should be empty: no title set, without answer', () => {
        const answersUtil = new Answers();
        // Empty entry object
        const entry = {};

        // Input ref and input
        const inputRef = 'xxx';
        const input = getInput('text', inputRef);

        // Supply answer for the input
        entry.answers = {};
        entry.answers[inputRef] = { answer: '' };

        // Group input ref and input
        const groupInputRef = 'ggg_xxx';
        // Group
        const group = {
            [groupInputRef]: [
                inputRef
            ]
        };

        const groupInput = getInput('group', groupInputRef, false, [], group);

        // List of top level input refs
        const inputs = [groupInputRef];

        // List of all inputs
        const inputList = {
            [groupInputRef]: { data: groupInput },
            [inputRef]: { data: input },
        };


        // Expect that we receive an empty titles array, because there is no title set
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual([]);
    });

    it('group titles should be empty: title set, checkbox input, without answer', () => {
        const answersUtil = new Answers();
        // Empty entry object
        const entry = {};

        // Input ref and input
        const inputRef = 'xxx';
        const input = getInput('checkbox', inputRef, true);

        // Supply answer for the input
        entry.answers = {};
        entry.answers[inputRef] = { answer: [] };

        // Group input ref and input
        const groupInputRef = 'ggg_xxx';
        // Group
        const group = {
            [groupInputRef]: [
                inputRef
            ]
        };

        const groupInput = getInput('group', groupInputRef, false, [], group);

        // List of top level input refs
        const inputs = [groupInputRef];

        // List of all inputs
        const inputList = {
            [groupInputRef]: { data: groupInput },
            [inputRef]: { data: input },
        };


        // Expect that we receive an empty titles array, because there is no title answer given
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual([]);

    });

    it('group titles should be array with one csv value "yes, no": title set, checkbox input, with answer', () => {

        // Create a group and two inputs inside the group - a text and a checkbox

        const answersUtil = new Answers();
        // Empty entry object
        const entry = {};

        // Checkbox input ref and input
        const inputRefCheckBox = 'xxx_check';
        const inputCheckBox = getInput('checkbox', inputRefCheckBox, true,
            [
                {
                    "answer": "yes",
                    "answer_ref": "a"
                },
                {
                    "answer": "no",
                    "answer_ref": "b"
                }
            ]
        );
        // Text input ref and input
        const inputRefText = 'xxx_text';
        const inputText = getInput('checkbox', inputRefText);

        // Supply answer for the inputs
        entry.answers = {};
        entry.answers[inputRefCheckBox] = { answer: ['a', 'b'] };
        entry.answers[inputRefText] = { answer: 'bob' };


        // Group input ref
        const groupInputRef = 'ggg_xxx';
        // Group
        const group = {
            [groupInputRef]: [
                inputRefText,
                inputRefCheckBox
            ]
        };
        // Group input
        const groupInput = getInput('group', groupInputRef, false, [], group);

        // List of top level input refs
        const inputs = [groupInputRef];

        // List of all inputs
        const inputList = {
            [groupInputRef]: { data: groupInput },
            [inputRefText]: { data: inputText },
            [inputRefCheckBox]: { data: inputCheckBox }
        };

        // Expect that we receive a titles array with ['yes, no'] as only element
        expect(answersUtil.getAnswersTitles(entry, inputs, group, inputList)).toEqual(['yes, no']);
    });

});
