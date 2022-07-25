import EC5_LIBRARIES from 'ec5-libraries';

/**
 *
 * @param jwtToken
 * @returns {string}
 */
export const getAuthorisationHeader = (jwtToken) => {
    return 'Bearer ' + jwtToken;
};

/**
 *
 * @param uuid
 * @param ext
 * @returns {string}
 */
export const generateMediaFilenameWeb = (uuid, ext) => {
    const _generateTimestamp = () => {
        return Math.floor(Date.now() / 1000);
    };
    return uuid + '_' + _generateTimestamp() + '.' + ext;
};

/**
 *
 * @param dateTime
 * @returns {*}
 */
export const parseDate = (dateTime) => {
    // Format the time without the timezone and reset HH:mm:ss.SSS to 0
    return dateTime.format('YYYY-MM-DD[T]') + '00:00:00.000';
};

/**
 *
 * @param dateTime
 * @returns {*}
 */
export const parseTime = (dateTime) => {
    // Format the time without the timezone
    return dateTime.format('YYYY-MM-DD[T]HH:mm:ss.SSS');
};


export const getIsoDateTime = () => {
    return EC5_LIBRARIES.UtilsService.getIsoDateTime();
};


export const truncateWithEllipses = (text, max) => {
    return text.substr(0, max - 1) + (text.length > max ? '...' : '');
};
