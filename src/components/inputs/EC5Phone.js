import React from 'react';
import strings from '../../constants/strings';

const EC5Phone = ({ answer, onInputChange, focus }) => {

    return (
        <div>
            <input
                autoFocus={focus}
                className="form-control"
                type="tel"
                value={answer}
                onChange={(event) => {
                    onInputChange(event.target.value);
                }}
                placeholder={strings.type_answer_here}
            />
        </div>
    );


};

EC5Phone.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    focus: React.PropTypes.bool
};

export default EC5Phone;
