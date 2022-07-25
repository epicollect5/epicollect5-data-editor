import Answers from '../../src/utils/Answers';

describe('answer utils test', () => {


    function getInput(type, ref, setToCurrentDatetime = false, isTitle = false, possibleAnswers = []) {
        return {
            "max": null,
            "min": null,
            "ref": ref,
            "type": type,
            "group": [],
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


    it('should return empty answer - text input', () => {
        const answersUtil = new Answers();
        // No existing answer
        expect(answersUtil.getDefaultAnswer({}, getInput('text', 'xxx'))).toEqual('');
    });

    it('should return "hello" answer - text input', () => {
        const answersUtil = new Answers();
        // Existing answer
        const answers = {
            xxx: 'hello'
        };
        expect(answersUtil.getDefaultAnswer(answers, getInput('text', 'xxx'))).toEqual('hello');
    });

    it('should return empty answer - checkbox input', () => {
        const answersUtil = new Answers();
        // No existing answer
        expect(answersUtil.getDefaultAnswer({}, getInput('checkbox', 'xxx'))).toEqual([]);
    });

    it('should return empty answer - location input', () => {
        const answersUtil = new Answers();
        // No existing answer
        expect(answersUtil.getDefaultAnswer({}, getInput('location', 'xxx'))).toEqual({
            latitude: '',
            longitude: '',
            accuracy: ''
        });
    });

});
