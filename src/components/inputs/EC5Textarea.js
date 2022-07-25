import React from 'react';
import strings from '../../constants/strings';

const EC5Textarea = ({ answer, onInputChange, focus }) => (

    <div>
        <textarea
            autoFocus={focus}
            className="form-control"
            value={answer}
            onChange={(event) => {
                onInputChange(event.target.value);
            }}
            placeholder={strings.type_answer_here}
            rows="10"
        >
        </textarea>
    </div>

);

EC5Textarea.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    focus: React.PropTypes.bool
};

export default EC5Textarea;
