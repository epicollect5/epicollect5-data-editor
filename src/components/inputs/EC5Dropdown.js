import React from 'react';

const EC5Dropdown = ({ answer, onInputChange, input, focus }) => {

    const possibleAnswers = input.possible_answers;
    const html = [];

    possibleAnswers.forEach((possibleAnswer) => {

        // Push dropdown to html array
        html.push(
            <option
                value={possibleAnswer.answer_ref}
                key={possibleAnswer.answer_ref}
            >
                {possibleAnswer.answer}
            </option>
        );
    });
    // todo make select min-width: 250px;
    return (
        <div className="input-group">
            <select
                autoFocus={focus}
                className="form-control ec5-dropdown"
                value={answer}
                onChange={(event) => {
                    onInputChange(event.target.value);
                }}
            >
                <option value="">Pick possible answer</option>
                {html}
            </select>
        </div>
    );
};

EC5Dropdown.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object,
    focus: React.PropTypes.bool
};

export default EC5Dropdown;

