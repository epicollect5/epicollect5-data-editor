import EC5_LIBRARIES from 'ec5-libraries';

export default class Jumps {

    /**
     *
     * @param project
     * @param formRef
     * @param answer
     * @param input
     * @param nextInputRef
     * @param nextInputIndex
     * @param ownerInputRef
     * @param isBranch
     * @returns {{newNextInputRef: *, newNextInputIndex: *}}
     */
    jumpNext({ project, formRef, answer, input, nextInputRef, nextInputIndex, ownerInputRef, isBranch }) {

        // Initialise
        let newNextInputRef = nextInputRef;
        let newNextInputIndex = nextInputIndex;

        // Check if we have jumps here
        if (input.jumps.length > 0) {

            // Get the newNextInputRef
            newNextInputRef = EC5_LIBRARIES.JumpService.getNextInputRef(answer, input, nextInputRef);

            if (isBranch) {
                newNextInputIndex = project.getBranchInputIndexFromRef(formRef, ownerInputRef, newNextInputRef);
            } else {
                newNextInputIndex = project.getInputIndexFromRef(formRef, newNextInputRef);
            }

        }

        return { newNextInputRef, newNextInputIndex };
    }

    /**
     * Go back to the most previously not jumped question
     *
     * @param answers
     * @param inputs
     * @param previousInputRef
     * @param previousInputIndex
     * @returns {{previousInputRef: *, previousInputIndex: *}}
     */
    jumpPrevious(answers, inputs, previousInputRef, previousInputIndex) {

        let newPreviousInputRef = previousInputRef;
        let newPreviousInputIndex = previousInputIndex;

        while (answers[newPreviousInputRef].was_jumped === true) {
            newPreviousInputIndex = newPreviousInputIndex - 1;
            newPreviousInputRef = inputs[newPreviousInputIndex];
        }

        return {
            newPreviousInputRef,
            newPreviousInputIndex
        };

    }

}
