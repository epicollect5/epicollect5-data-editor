import EC5_LIBRARIES from 'ec5-libraries';

export default class Validator {

    /**
     * Constructor
     */
    constructor() {
        this.errors = [];
    }

    /**
     *
     * @param inputs
     * @param currentInputRef
     * @param answers
     * @param confirmAnswers
     * @returns {boolean}
     */
    validate(inputs, currentInputRef, answers, confirmAnswers) {

        // Set up the validators to use
        window.EC5_LIBRARIES.AnswerValidateHelper.setValidators({
            text: window.EC5_LIBRARIES.TextValidate,
            integer: window.EC5_LIBRARIES.IntegerValidate,
            decimal: window.EC5_LIBRARIES.DecimalValidate,
            radio: window.EC5_LIBRARIES.RadioValidate,
            dropdown: window.EC5_LIBRARIES.DropdownValidate,
            date: window.EC5_LIBRARIES.DateValidate,
            time: window.EC5_LIBRARIES.TimeValidate,
            textarea: window.EC5_LIBRARIES.TextareaValidate
        });

        // Clear any previous errors
        this.errors = [];
        EC5_LIBRARIES.AnswerValidateHelper.resetErrors();

        // Assume it will pass
        let passed = true;

        const currentInput = inputs[currentInputRef].data;

        // Validate
        switch (currentInput.type) {
            default: {
                // Validate a single input
                const answer = typeof answers[currentInputRef] === 'undefined' || answers[currentInputRef] === null ? '' : answers[currentInputRef];
                const confirmAnswer = typeof confirmAnswers[currentInputRef] === 'undefined' || confirmAnswers[currentInputRef] === null ? '' : confirmAnswers[currentInputRef];
                // Do checks
                if (!this.doChecks(currentInput, answer, confirmAnswer)) {
                    passed = false;
                }
            }
        }

        return passed;

    }

    /**
     * Do all the validation checks
     *
     * @param input
     * @param answer
     * @param confirmAnswer
     * @returns {boolean}
     */
    doChecks(input, answer, confirmAnswer) {

        // If we have a required field, check
        if (!window.EC5_LIBRARIES.AnswerValidateHelper.checkRequired(input, answer)) {
            // Assign errors from the answer validator helper
            this.errors = window.EC5_LIBRARIES.AnswerValidateHelper.getErrors();
            return false;
        }

        // If we have a confirm field, check
        if (answer !== null && confirmAnswer !== null) {
            if (!window.EC5_LIBRARIES.AnswerValidateHelper.checkConfirmed(input, answer, confirmAnswer)) {
                // Assign errors from the answer validator helper
                this.errors = window.EC5_LIBRARIES.AnswerValidateHelper.getErrors();
                return false;
            }
        }

        // If we have a regex field, check
        if (answer !== '' && answer !== null && typeof answer !== 'undefined') {
            if (!window.EC5_LIBRARIES.AnswerValidateHelper.checkRegex(input, answer)) {
                // Assign errors from the answer validator helper
                this.errors = window.EC5_LIBRARIES.AnswerValidateHelper.getErrors();
                return false;
            }
        }

        // Checks this answer against the input type
        if (!window.EC5_LIBRARIES.AnswerValidateHelper.answerChecks({
                input_details: input,
                answer: {
                    answer
                }
            })) {
            // Assign errors from the answer validator helper
            this.errors = window.EC5_LIBRARIES.AnswerValidateHelper.getErrors();
            return false;
        }

        return true;
    }

    /**
     * Check a confirm/verify answer
     *
     * @param input
     * @param answer
     * @param confirmAnswer
     * @returns {boolean}
     */
    checkConfirmed(input, answer, confirmAnswer) {
        // If we have a confirm field, check
        if (answer !== null && confirmAnswer !== null) {
            if (!window.EC5_LIBRARIES.AnswerValidateHelper.checkConfirmed(input, answer, confirmAnswer)) {
                // Assign errors from the answer validator helper
                this.errors = window.EC5_LIBRARIES.AnswerValidateHelper.getErrors();
                return false;
            }
        }

        return true;
    }

}
