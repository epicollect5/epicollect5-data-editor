import React from 'react'
import moment from 'moment'
import { shallow } from 'enzyme'
import EC5Time from '../../../src/components/inputs/EC5Time';
import strings from '../../../src/constants/strings';

function setup(setDefault = false) {
    const props = {
        answer: '',
        input: {
            "max": null,
            "min": null,
            "ref": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "type": "time",
            "group": [],
            "jumps": [],
            "regex": null,
            "branch": [],
            "verify": false,
            "default": null,
            "is_title": false,
            "question": "what time is it?",
            "uniqueness": "none",
            "is_required": false,
            "datetime_format": "HH:mm:ss",
            "possible_answers": [],
            "set_to_current_datetime": setDefault
        }
    };

    props.onInputChange = (answer) => {
        props.answer = answer;
    };

    const enzymeWrapper = shallow(<EC5Time {...props} />);

    return {
        props,
        enzymeWrapper
    }
}

describe('components', () => {
    describe('EC5Time', () => {

        it('no default time should be empty', () => {
            const { enzymeWrapper, props } = setup();
            const span = enzymeWrapper.find('span');
            expect(span.text()).toBe(strings.time_selected_is + ' ' + '--');
            expect(props.answer).toBe('');
        });

        it('time should show', () => {
            const { props } = setup();
            const time = moment().utcOffset(120);

            // Parse the time without the timezone
            let parsedTime = time.format('YYYY-MM-DD[T]HH:mm:ss');
            // Make utc to add utc timezone back in
            let inputTime = moment.utc(parsedTime);
            // Parse to iso string for saving
            let answerTime = inputTime.toISOString();
            props.onInputChange(answerTime);

            expect(props.answer).toBe(answerTime);
       });


    })
});
