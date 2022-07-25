import moment from 'moment';
import EC5_LIBRARIES from 'ec5-libraries';
import { parseTime, parseDate } from '../utils/Utils';

export default class Answers {

    /**
     *
     * @param inputDetails
     * @param answer
     * @returns {*}
     */
    parseAnswerForViewing(inputDetails, answer) {

        let checkBoxAnswers;
        let datasetAnswers;

        switch (inputDetails.type) {
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_RADIO_TYPE:
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_DROPDOWN_TYPE:
                Object.keys(inputDetails.possible_answers)
                    .forEach((key) => {
                        if (answer === inputDetails.possible_answers[key].answer_ref) {
                            answer = inputDetails.possible_answers[key].answer;
                        }
                    });
                break;
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_CHECKBOX_TYPE:
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_SEARCH_SINGLE_TYPE:
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_SEARCH_MULTIPLE_TYPE:

                checkBoxAnswers = [];

                Object.keys(inputDetails.possible_answers)
                    .forEach((key) => {
                        if (answer.indexOf(inputDetails.possible_answers[key].answer_ref) > -1) {
                            checkBoxAnswers.push(inputDetails.possible_answers[key].answer);
                        }
                    });

                answer = checkBoxAnswers.join(', ');

                break;
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_TIME_TYPE:
                answer = answer ? EC5_LIBRARIES.UtilsService.getUserFormattedTime(answer, inputDetails.datetime_format) : '';
                break;
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_DATE_TYPE:
                answer = answer ? EC5_LIBRARIES.UtilsService.getUserFormattedDate(answer, inputDetails.datetime_format) : '';
                break;
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_BRANCH_TYPE:
                if (answer[inputDetails.ref]) {
                    answer = answer[inputDetails.ref] + ' ' + (answer[inputDetails.ref] > 1 ? 'entries' : 'entry');
                } else {
                    answer = '0 entries';
                }
                break;

            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_DATASET_SINGLE_TYPE:
            case EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_DATASET_MULTIPLE_TYPE:
                datasetAnswers = [];

                answer = datasetAnswers;

                break;
        }

        return answer;
    }

    /**
     *
     * @param answers
     * @param input
     * @returns {*}
     */
    getDefaultAnswer(answers, input) {
        // Get the answer from the 'answers' object if it exists
        if (typeof answers[input.ref] !== 'undefined') {
            return answers[input.ref];
        } else if (input.set_to_current_datetime) {
            // If set_to_current_datetime is true
            switch (input.type) {
                case 'time':
                    // Parse the local time
                    return parseTime(moment());
                case 'date':
                    // Parse the local date
                    return parseDate(moment());
            }
        }

        // Otherwise assign an empty default
        return EC5_LIBRARIES.AnswerService.createDefaultAnswer(input).answer;
    }

    /**
     *
     * @param input
     * @returns {*}
     */
    getEmptyDefaultAnswer(input) {
        // Return an empty default
        return EC5_LIBRARIES.AnswerService.createDefaultAnswer(input).answer;
    }

    /**
     *
     * @param entry
     * @param inputs
     * @param group
     * @param inputList
     * @returns {Array}
     */
    getAnswersTitles(entry, inputs, group, inputList) {
        return EC5_LIBRARIES.AnswerService.getAnswersTitles(entry, inputs, group, inputList, this.parseAnswerForViewing);
    }
}
