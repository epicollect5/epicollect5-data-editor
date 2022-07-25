import React, { Component } from 'react';
import EC5_LIBRARIES from 'ec5-libraries';
import { connect } from 'react-redux';
import Question from './Question';

class GroupQuestion extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {

        const { uuid, form, inputs, input, errors, statusCodes } = this.props;

        const groupQuestionRefs = form.group[input.ref];
        const groupQuestions = [];
        let groupHasError = false;
        let groupError;
        // Give the first question focus
        let focus = true;

        // Iterate over all group question and produce the markup
        groupQuestionRefs.forEach((currentInputRef) => {
            const currentInput = inputs[currentInputRef].data;

            if (errors[uuid] && errors[uuid][currentInput.ref]) {
                groupHasError = true;
            }
            groupQuestions.push(
                <Question
                    key={currentInput.ref}
                    currentInputRef={currentInput.ref}
                    input={currentInput}
                    uuid={uuid}
                    focus={focus}
                />
            );

            focus = false;
        });

        // If there is an error with one of the group questions, alert user
        if (groupHasError) {
            groupError = (<span className="ec5-error">{statusCodes.ec5_128}</span>);
        }

        // Return the rendered markup
        return (
            <div className="ec5-group form-group ec5-card col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
                <div className="ec5-label ec5-label--group-header"><p>{this.props.input.question}</p></div>
                {groupError}
                {groupQuestions}
            </div>
        );
    }

}

function mapStateToProps(state) {

    const { formReducer, validatorReducer, projectReducer, generalReducer } = state;
    const { currentInputRef, currentInputIndex } = formReducer;
    const { project } = projectReducer;
    const { errors } = validatorReducer;
    const { statusCodes } = generalReducer;
    return {
        currentInputRef,
        currentInputIndex,
        inputs: project.getInputsExtra(),
        errors,
        statusCodes
    };

}

GroupQuestion.propTypes = {
    uuid: React.PropTypes.string,
    errors: React.PropTypes.object,
    form: React.PropTypes.object,
    inputs: React.PropTypes.object,
    input: React.PropTypes.object,
    statusCodes: React.PropTypes.object
};

export default connect(mapStateToProps)(GroupQuestion);
