import moment from 'moment';
import { parseTime, parseDate, getIsoDateTime } from '../../src/utils/Utils';

describe('date time testing', () => {

    // Testing here that when a time is picked, that time should be saved, regardless of timezone (also without the timezone)
    it('time should be "2017-03-08T22:15:01.000" (+9 hours)', () => {
        let time = moment.parseZone("2017-03-08T22:15:01+09:00");
        expect(parseTime(time)).toEqual('2017-03-08T22:15:01.000');
    });

    it('time should be "2017-03-08T22:15:01.000" (-9 hours)', () => {
        let time = moment.parseZone("2017-03-08T22:15:01-09:00");
        expect(parseTime(time)).toEqual('2017-03-08T22:15:01.000');
    });

    it('time should be "2014-06-01T12:34:12.000" (UTC)', () => {
        let time = moment.parseZone("2017-03-08T22:15:01Z");
        expect(parseTime(time)).toEqual('2017-03-08T22:15:01.000');
    });


    // Testing here that when a date is picked, that date should be saved, regardless of timezone (also without the timezone)
    it('date should be "2017-03-08T00:00:00.000" (+9 hours)', () => {
        let time = moment.parseZone("2017-03-08T22:15:01+09:00");
        expect(parseDate(time)).toEqual('2017-03-08T00:00:00.000');
    });

    it('date should be "2017-03-08T00:00:00.000" (-9 hours)', () => {
        let time = moment.parseZone("2017-03-08T22:15:01-09:00");
        expect(parseDate(time)).toEqual('2017-03-08T00:00:00.000');
    });

    it('date should be "2017-03-08T00:00:00.000" (UTC)', () => {
        let time = moment.parseZone("2017-03-08T22:15:01Z");
        expect(parseDate(time)).toEqual('2017-03-08T00:00:00.000');
    });


    it('created_at should be local time in UTC', () => {

        // We expect that the date will be a new date object
        let expectedDate = new Date();
        // Need to reset the milliseconds here
        expectedDate.setMilliseconds(0);

        let date = new Date(getIsoDateTime());
        // Need to reset the milliseconds here
        date.setMilliseconds(0);

        expect(expectedDate.toISOString()).toEqual(date.toISOString());
    });


});
