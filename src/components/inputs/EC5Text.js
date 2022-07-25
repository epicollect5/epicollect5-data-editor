import React from 'react';
import strings from '../../constants/strings';

const EC5Text = ({ answer, onInputChange, focus }) => {

    return (
        <div>
            <input
                autoFocus={focus}
                className="form-control"
                type="text"
                value={answer}
                onChange={(event) => {
                    onInputChange(event.target.value);
                }}
                placeholder={strings.type_answer_here}
            />
        </div>
    );
};

EC5Text.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    focus: React.PropTypes.bool
};

export default EC5Text;
