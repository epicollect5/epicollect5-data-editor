import React from 'react';

const EC5Radio = ({ answer, onInputChange, input }) => {

    const possibleAnswers = input.possible_answers;
    const html = [];

    possibleAnswers.forEach((possibleAnswer) => {

        // Push radio to html array
        html.push(
            <label
                htmlFor={possibleAnswer.answer_ref}
                className="ec5-radio"
                key={possibleAnswer.answer_ref}
            >
                <input
                    id={possibleAnswer.answer_ref}
                    type="radio"
                    value={possibleAnswer.answer_ref}
                    checked={possibleAnswer.answer_ref === answer ? 'checked' : ''}
                    onChange={(event) => {
                        onInputChange(event.target.value);
                    }}
                />
                {possibleAnswer.answer}
            </label>
        );
    });
    return (
        <div className="input-group">
            <div className="btn-group" data-toggle="buttons">
                {html}
            </div>
        </div>
    );
};

EC5Radio.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object
};

export default EC5Radio;

