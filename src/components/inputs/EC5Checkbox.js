import React from 'react';

const EC5Checkbox = ({ answer, onInputChange, input }) => {

    const possibleAnswers = input.possible_answers;
    const html = [];
    // The answers for checkboxes is an array
    // const answers = answer.slice() || [];
    const answers = [...answer] || [];

    possibleAnswers.forEach((possibleAnswer) => {

        // Determine whether this radio should be preselected
        html.push(
            <label
                htmlFor={possibleAnswer.answer_ref}
                className="ec5-checkbox"
                key={possibleAnswer.answer_ref}
            >
                <input
                    id={possibleAnswer.answer_ref}
                    type="checkbox"
                    value={possibleAnswer.answer_ref}
                    onChange={(event) => {
                        // todo use includes
                        const index = answers.indexOf(event.target.value);

                        // Add if checked
                        if (index === -1) {
                            answers.push(event.target.value);
                        } else {
                            // Remove if unchecked
                            answers.splice(index, 1);
                        }
                        onInputChange(answers);
                    }}
                    checked={answers.indexOf(possibleAnswer.answer_ref) !== -1 ? 'checked' : ''}
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

EC5Checkbox.propTypes = {
    answer: React.PropTypes.array,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object
};

export default EC5Checkbox;
