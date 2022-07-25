import React from 'react';
import Question from './Question';
import BranchQuestion from './BranchQuestion';
import GroupQuestion from './GroupQuestion';

const QuestionContainer = ({ form, inputs, entry, currentInputRef }) => {
    const currentInput = inputs[currentInputRef].data;
    let question;

    //Switch on question type
    switch (currentInput.type) {
        case 'branch':
            question = (<BranchQuestion
                key={currentInput.ref}
                ownerInput={currentInput}
                ownerEntryUuid={entry.id}
            />);
            break;
        case 'group':
            question = (<GroupQuestion
                key={currentInput.ref}
                form={form}
                input={currentInput}
                uuid={entry.id}
            />);
            break;
        default:
            question = (<Question
                key={currentInput.ref}
                currentInputRef={currentInput.ref}
                input={currentInput}
                uuid={entry.id}
                focus
            />);
    }

    return (
        <div>
            <div className="ec5-view text-center">
                {question}
            </div>
        </div>
    );

};

QuestionContainer.propTypes = {
    form: React.PropTypes.object,
    inputs: React.PropTypes.object,
    entry: React.PropTypes.object,
    currentInputRef: React.PropTypes.string

};

export default QuestionContainer;
