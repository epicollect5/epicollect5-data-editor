import React from 'react';

const EC5Decimal = ({ answer, onInputChange, focus }) => (
    <div>
        <input
            autoFocus={focus}
            className="form-control"
            type="number"
            step="0.1"
            value={answer}
            onChange={(event) => {
                // Don't call parseFloat with no answer
                onInputChange(parseFloat(event.target.value) !== parseFloat(event.target.value) || typeof event.target.value === 'undefined' || event.target.value === null ? '' : parseFloat(event.target.value));
            }}
        />
    </div>

);

EC5Decimal.propTypes = {
    answer: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    onInputChange: React.PropTypes.func,
    focus: React.PropTypes.bool
};

export default EC5Decimal;
