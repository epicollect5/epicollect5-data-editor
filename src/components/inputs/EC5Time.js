import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import EC5_LIBRARIES from 'ec5-libraries';
import strings from '../../constants/strings';
import { parseTime } from '../../utils/Utils';

const getMomentFormat = (format) => {

    switch (format) {
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_1:
            //HH:mm:ss (24 hrs format)
            return 'HH:mm:ss';
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_2:
            //hh:mm:ss (12 hrs format)
            return 'h:mm:ss A';
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_3:
            //HH:mm (24hrs format)
            return 'HH:mm';
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_4:
            //hh:mm (12 hrs format)
            return 'h:mm A';
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_5:
            //hh:mm:ss (12 hrs format)
            return 'mm:ss';
    }

};

const getMomentInputFormat = (format) => {

    switch (format) {
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_1:
            //HH:mm:ss (24 hrs format)
            return 'HH:mm:ss';
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_2:
        //hh:mm:ss (12 hrs format)
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_5:
            //mm:ss
            // NOTE: Datetime doesn't allow mm:ss only so just use hh:mm:ss
            return 'h:mm:ss A';
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_3:
            //HH:mm (24hrs format)
            return 'HH:mm';
        case EC5_LIBRARIES.PARAMETERS.TIME_FORMAT_4:
            //hh:mm (12 hrs format)
            return 'h:mm A';

    }

};

const EC5Time = ({ answer, onInputChange, input }) => {

    const answerTime = answer;
    let displayTime;
    let inputTime;

    // If answer is empty, check if set_to_current_datetime is true
    if (answerTime === '') {
        inputTime = null;
        displayTime = '--';
    } else {
        // Get utc time
        inputTime = moment.utc(answerTime);
        // Display using ec5 to moment mapping
        displayTime = inputTime.format(getMomentFormat(input.datetime_format));
    }

    return (
        <div>
            <Datetime
                timeFormat={getMomentInputFormat(input.datetime_format)}
                value={inputTime}
                input={false}
                onChange={(time) => {
                    onInputChange(parseTime(time));
                }}
                dateFormat={false}
            />
            <span className="ec5-time-selected">{strings.time_selected_is} {displayTime}</span>
        </div>
    );
};

EC5Time.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object
};

export default EC5Time;
