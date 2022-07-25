import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import strings from '../../constants/strings';
import { parseDate } from '../../utils/Utils';

const getMomentFormat = (format) => {

    switch (format) {
        case window.EC5_LIBRARIES.PARAMETERS.DATE_FORMAT_1:
            //'dd/MM/YYYY',
            return 'D/MM/YYYY';
        case window.EC5_LIBRARIES.PARAMETERS.DATE_FORMAT_2:
            //'MM/dd/YYYY',
            return 'MM/D/YYYY';
        case window.EC5_LIBRARIES.PARAMETERS.DATE_FORMAT_3:
            //'YYYY/MM/dd',
            return 'YYYY/MM/D';
        case window.EC5_LIBRARIES.PARAMETERS.DATE_FORMAT_4:
            //'MM/YYYY',
            return 'MM/YYYY';
        case window.EC5_LIBRARIES.PARAMETERS.DATE_FORMAT_5:
            //'dd/MM',
            return 'D/MM';
    }

};

const EC5Date = ({ answer, onInputChange, input }) => {

    let answerDate = answer;
    let displayDate;
    let inputDate;

    // If answer is empty, check if set_to_current_datetime is true
    if (answerDate === '') {
        inputDate = null;
        displayDate = '--';
    } else {
        // Get utc time
        inputDate = moment.utc(answerDate);
        // Display using ec5 to moment mapping
        displayDate = inputDate.format(getMomentFormat(input.datetime_format));
    }

    return (
        <div>
            <Datetime
                value={inputDate}
                input={false}
                onChange={(date) => {
                    onInputChange(parseDate(date));
                }}
                timeFormat={false}
            />
            <span>{strings.date_selected_is} {displayDate}</span>
        </div>
    );
};

EC5Date.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object
};

export default EC5Date;
