import React from 'react';

const EC5Integer = ({ answer, onInputChange, focus }) => (
    <div>
        <input
            autoFocus={focus}
            className="form-control"
            type="text"
            value={answer}
            onChange={(event) => {
                // Don't call parseInt with no answer
                onInputChange(parseInt(event.target.value, 10) !== parseInt(event.target.value, 10) || typeof event.target.value === 'undefined' || event.target.value === null ? '' : parseInt(event.target.value, 10));
            }}
        />
    </div>

);

EC5Integer.propTypes = {
    answer: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    onInputChange: React.PropTypes.func,
    focus: React.PropTypes.bool
};

export default EC5Integer;
