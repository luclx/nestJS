import { LoggingService } from './logging.service';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as Jimp from 'jimp';
import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

export class UtilsService {

    /**
     * generate hash from password or string
     * @param {string} password
     * @returns {string}
     */
    static generateHash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * validate text with hash
     * @param {string} password
     * @param {string} hash
     * @returns {Promise<boolean>}
     */
    static validateHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash || '');
    }

    /**
     * generate random string
     * @param length
     */
    static generateRandomString(length: number) {
        return Math.random()
            .toString(36)
            .replace(/[^a-zA-Z0-9]+/g, '')
            .substr(0, length);
    }

    /**
     * Convert string to number
     * @param  {array} _data      an array of objects.
     * @param  {string} _attribute    attribute name to convert to number
     * @param  {number} _decimalPlaces  optional parameter which defines the decimal places.
     * @return {Array}
     */
    static toNumber(_data: any, _attribute, _decimalPlaces = 0): Promise<[]> {
        for (var i = 0; i < _data.length; i++) {
            if (_decimalPlaces > 0) {
                _data[i][_attribute] = Number(Number(_data[i][_attribute]).toFixed(_decimalPlaces));
            } else if (_decimalPlaces <= 0) {
                _data[i][_attribute] = Number(_data[i][_attribute]);
            }
        }
        return _data;
    }

    /**
     * Convert number to 2 decimal places.
     * @param  _number          number input.
     * @param  _decimalPlaces=2 number of decimal places.
     * @return                  number
     */
    static toNumberDecimalPlaces(_number: any, _decimalPlaces = 2): number {
        return Number(
            Number(_number).toFixed(2)
        );
    }

    /**
     * Replace undefined or null value in object to empty string
     * @param   _data       an object.
     * @return              an object
     */
    static replaceNonValueToEmpty(_data: any): Object {
        if (_.isObject(_data)) {
            return JSON.parse(JSON.stringify(_data, (key, value) => _.isNil(value) ? '' : value));
        }
        return _data;
    }

    /**
     * Replace null or undefined value to empty string of single object or each object in array of objects.
     * @param   _data       an array of objects.
     * @return              an array or object
     */
    static replaceNonValueKeys(_data: any): Array<Object> | Object {
        if (_.isArray(_data)) {
            const filteredArray = _data.map(item => this.replaceNonValueToEmpty(item));
            return filteredArray;
        } else if (_.isObject(_data)) {
            return this.replaceNonValueToEmpty(_data)
        }
        return _data;
    }

    /**
     * Remove null or undefined value of single object or each object in array of objects.
     * @param   _data       an array of objects.
     * @return              an array or object
     */
    static removeNonValueKeys(_data: any): Array<Object> | Object {
        if (_.isArray(_data)) {
            const filteredArray = _data.map(item => Object.entries(item).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {}));
            return filteredArray;
        } else if (_.isObject(_data)) {
            return Object.entries(_data).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {})
        }
        return _data;
    }

    /**
     * Remove object from array.
     * @param  {array} _data an array
     * @return {Object}
     */
    static removeObjectFromArray(_data: any): Promise<[]> {
        for (var obj in _data) {
            if (_.isObject(_data[obj])) {
                delete _data[obj];
            }
        }
        return _data;
    }

    static toSnakeCase(value: string): string {
        if (typeof value === 'string') {
            return value.toLocaleLowerCase().replace(/\W+/g, ' ')
                .split(/ |\B(?=[A-Z])/)
                .join('_');
        }
        return '';
    }

    static generateUUID(_string = 'xxxxxxxxxx') {
        let d = new Date().getTime();
        const uuid = _string.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(36);
        });
        return uuid;
    }

    static handleBadRequest(req, err) {
        LoggingService.error({
            user: _.get(req, 'user.full_name'),
            route: "Requested :: " + req.method + ' ' + req.url,
            error: err
        });
        throw new BadRequestException(err?.message || err);
    }

    static isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
        return typeof obj === 'undefined' || obj === null;
    }

    static initTransparentImage(width, height) {
        return new Promise((resolve, reject) => {
            const _trans_image = new Jimp(width, height, 0x0,  (err, image) => {
                if(err) return reject(err);
                return resolve(_trans_image);
            });
        })
    }

    static getBusinessDays(startDate, endDate) {
        const day = moment(startDate);
        let businessDays = 0;

        while (day.isSameOrBefore(endDate, 'day')) {
            // Defines days from 1 (Monday) to 6 (Saturday) as business days.
            if (day.day() !== 0) businessDays++;
            day.add(1, 'd');
        }
        return businessDays;
    }

    static getNoOfDayFromBusinessDay(curDate, businessDay) {
        const day = moment(curDate);
        let no = 1;

        while (no <= businessDay) {
            // Defines days from 1 (Monday) to 6 (Saturday) as business days.
            if (day.day() !== 0) no++;
            day.add(1, 'd');
        }
        return day.diff(moment(curDate), 'days');
    }

    static getUTCOffset(req) {
        return req.headers['utc_offset'] || 8;
    }

    static handleFormData(req) {
        const body = _.cloneDeep(JSON.parse(JSON.stringify(req.body)));
        return _.isObject(body) && body.hasOwnProperty('formData') ? JSON.parse(body.formData) : req.body;
    }

    static isSuperAdmin(req) {
        return req['role'].name === 'Super Admin';
    }
}
