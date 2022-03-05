import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetLocationService } from '../asset-location/asset-location.service';
import { OccupancyService } from './../occupancy/occupancy.service';
'use strict';

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const _ = require('lodash');
const moment = require('moment');

@ApiTags('IoT')
@Controller({ path: 'iot', version: '1' })
/**
 * Import Controller
 *
 * This controller imports data from Excel.
 * @copyright	2022, S3 Innovate Pte. Ltd.
 * @author		Luc LX <liam@s3innovate.com>
 */
export class IoTController {

	constructor(
		private readonly assetLocationService: AssetLocationService,
		private readonly occupancyService: OccupancyService,
	) { }

	async getUTCOffset(req) {
		return req && req.headers['utc_offset'] ? req.headers['utc_offset'] : 8;
	}

	async getListOfDates(start, end, week = []) {
		const arr = [];
		const dt = moment(start).startOf('day');
		for (dt; dt.isSameOrBefore(moment(end).endOf('day'), 'd'); dt.add(1, 'day')) {
			if (!_.isEmpty(week)) {
				if (week.includes(dt.format('dddd'))) {
					arr.push(dt.format('YYYY-MM-DD'));
				}
			} else {
				arr.push(dt.format('YYYY-MM-DD'));
			}
		}
		return arr;
	};

	async addFilterCondition(fields, count, isRandomRoom = false, randomFromFbs = false) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = ``;
				const params = [];
				let paramCount = count;
				let childLocations = [];

				if (fields.building_id) {
					const building_id = _.isArray(fields.building_id) ? `{${fields.building_id.join(',')}}` : `{${fields.building_id}}`;
					params.push(building_id);
					paramCount++;
					query += ` AND al.building_id = ANY($${paramCount})`;
					isRandomRoom = false;
				}

				if (fields.asset_location_id) {
					childLocations = await AssetLocation.getAllChildren(fields.asset_location_id);
					params.push(`{${childLocations.map(i => i.id).join(',')}}`);
					paramCount++;
					query += ` AND al.id = ANY($${paramCount})`;
					isRandomRoom = false;
				}

				if (fields.room_type_id) {
					const room_type_id = _.isArray(fields.room_type_id) ? `{${fields.room_type_id.join(',')}}` : `{${fields.room_type_id}}`;
					params.push(room_type_id);
					paramCount++;
					query += ` AND r.room_type_id = ANY($${paramCount})`;
				}

				if (fields.room_id) {
					const room_id = _.isArray(fields.room_id) ? `{${fields.room_id.join(',')}}` : `{${fields.room_id}}`;
					params.push(room_id);
					paramCount++;
					query += ` AND r.id = ANY($${paramCount})`;
					isRandomRoom = false;
				}

				if (fields.department_id) {
					const department_id = _.isArray(fields.department_id) ? `{${fields.department_id.join(',')}}` : `{${fields.department_id}}`;
					params.push(department_id);
					paramCount++;
					query += ` AND d.id = ANY($${paramCount})`;
				}

				if (isRandomRoom) {
					let roomQuery = `
						select oh.room_id
						FROM "${fields.hat ? 'HumidityAndTemperature' : 'Occupancy'}" oh
						LEFT JOIN "AssetLocation" al ON oh.room_id = al.room_number
						LEFT JOIN "Room" r ON r.asset_location_id = al.id
						WHERE ${randomFromFbs ? 'r' : 'al'}.id is not null
					`;
					const roomParams = [];
					let roomParamCount = roomParams.length;

					if (!_.isEmpty(fields.random_room_id)) {
						roomQuery.id = fields.random_room_id;
					}

					if (fields.room_type_id) {
						const room_type_id = _.isArray(fields.room_type_id) ? `{${fields.room_type_id.join(',')}}` : `{${fields.room_type_id}}`;
						roomParams.push(room_type_id);
						roomParamCount++;
						roomQuery += ` AND r.room_type_id = ANY($${roomParamCount})`;
					}

					if (fields.asset_location_id) {
						const room_type_id = _.isArray(fields.asset_location_id) ? `{${fields.asset_location_id.join(',')}}` : `{${fields.asset_location_id}}`;
						roomParams.push(asset_location_id);
						roomParamCount++;
						roomQuery += ` AND r.asset_location_id = ANY($${roomParamCount})`;
					}

					if (fields.building_id) {
						const building_id = _.isArray(fields.building_id) ? `{${fields.building_id.join(',')}}` : `{${fields.building_id}}`;
						roomParams.push(building_id);
						roomParamCount++;
						roomQuery += ` AND r.building_id = ANY($${roomParamCount})`;
					}

					roomQuery += `
						GROUP BY oh.room_id
					`;

					Occupancy.query(roomQuery, roomParams, async (_err, _record) => {
						if (_err) return res.badRequest(_err);

						const rooms = _record['rows'];
						let room_id = fields.random_room_id;

						if (_.isEmpty(fields.random_room_id)) {
							room_id = _.shuffle(rooms.map(r => r.room_id)).slice(0, 10);
							fields.random_room_id = room_id;
						}

						params.push(`{${room_id.join(',')}}`);
						paramCount++;
						query += ` AND oh.room_id = ANY($${paramCount})`;

						resolve({
							query,
							params,
							random_room_id: fields.random_room_id
						});
					});
				} else {
					resolve({
						query,
						params
					});
				}
			} catch (err) {
				reject(err);
			}
		})
	}

	@Get('occupancy_room_status')
	async getOccupancyRooStatus(): Promise<void> {
		const allowedParameters = [
			'start_date_time',
			'end_date_time',
			'asset_location_id',
			'building_id',
			'room_type_id',
			'room_id',
			'hour',
			'custom_hour',
			'random_room_id'
		];
		const fields = _.pick(req.query, allowedParameters);
		const utc_offset = this.getUTCOffset(req);

		try {
			let query = `
					WITH cte AS (
						SELECT oh.room_id, extract(hour from oh."createdAt") as "hour",
							SUM(CASE WHEN (
								(b.id is not null and b.booking_duration @> oh."createdAt"::timestamptz)
								or (bh.id is not null and bh.booking_duration @> oh."createdAt"::timestamptz)
							) and oh.occupancy = TRUE THEN 1 ELSE 0 END) as booked_occupied,
							SUM(CASE WHEN (
								(b.id is not null and b.booking_duration @> oh."createdAt"::timestamptz)
								or (bh.id is not null and bh.booking_duration @> oh."createdAt"::timestamptz)
							) and oh.occupancy = FALSE THEN 1 ELSE 0 END) as booked_unoccupied,
							SUM(CASE WHEN b.id is null and bh.id is null and oh.occupancy = TRUE THEN 1 ELSE 0 END) as not_booked_occupied,
							SUM(CASE WHEN b.id is null and bh.id is null and oh.occupancy = FALSE THEN 1 ELSE 0 END) as not_booked_unoccupied
						FROM "Occupancy" oh
						LEFT JOIN "AssetLocation" al ON oh.room_id = al.room_number
						LEFT JOIN "Room" r ON r.asset_location_id = al.id
						LEFT JOIN "Booking" b ON b.room_id = r.id and b.booking_duration @> oh."createdAt"::timestamptz
						LEFT JOIN "BookingHistory" bh ON bh.room_id = r.id and bh.status = 'Booked' and bh.booking_duration @> oh."createdAt"::timestamptz
						WHERE r.id is not null
				`;
			let params = [];
			let paramCount = params.length;

			const filterContent = await this.addFilterCondition(fields, paramCount, true, true);
			if (filterContent) {
				query += filterContent.query;
				params = params.concat(filterContent.params);
				paramCount += params.length;
			}

			if (fields.start_date_time && fields.end_date_time) {
				const date_range = [];
				const begin = moment.utc(fields.start_date_time).add(utc_offset, 'hour').toISOString();
				const end = moment.utc(fields.end_date_time).add(utc_offset, 'hour').toISOString();
				const listDates = this.getListOfDates(begin, end);
				if (_.isEmpty(listDates)) {
					return res.badRequest({ message: req.__('inspection.plan.duration.empty') });
				}

				if (!_.isEmpty(fields.hour)) {
					const query_date = [];
					fields.hour.map(hour => {
						const addEndDay = +_.get(_.last(hour), 'hour') < +_.get(_.head(hour), 'hour') ? 1 : 0;

						listDates.map(date => {
							let startDate = moment(date).set(_.head(hour), 'hour').subtract(utc_offset, 'hour');
							let endDate = moment(date).add(addEndDay, 'day').set(_.last(hour), 'hour').subtract(utc_offset, 'hour');
							if (!fields.custom_hour) {
								endDate = endDate.endOf('hour');
							}
							date_range.push([
								startDate.toISOString(),
								endDate.toISOString(),
							]);
						});

						date_range.map(range => {
							let temp_query = '';
							params.push(_.head(range));
							paramCount++;
							temp_query += `(oh."createdAt" >= $${paramCount}`;
							params.push(_.last(range));
							paramCount++;
							temp_query += ` AND oh."createdAt" <= $${paramCount})`;
							query_date.push(temp_query);
						});
					});

					if (!_.isEmpty(query_date)) {
						query += ` AND (${query_date.join(' OR ')})`
					}
				}
			} else {
				return res.badRequest({ message: req.__('error.general') });
			}

			query += `
						GROUP BY oh.room_id, "hour"
						ORDER BY oh.room_id, extract(hour from oh."createdAt")
					)
					SELECT room_id, SUM(CASE WHEN booked_occupied > 0 THEN 1 ELSE 0 END) as booked_occupied, SUM(CASE WHEN booked_unoccupied > 0 THEN 1 ELSE 0 END) as booked_unoccupied, 
						SUM(CASE WHEN not_booked_occupied > 0 THEN 1 ELSE 0 END) as not_booked_occupied, SUM(CASE WHEN not_booked_occupied = 0 AND not_booked_unoccupied > 0 THEN 1 ELSE 0 END) as not_booked_unoccupied
					FROM cte
					GROUP BY room_id
					ORDER BY room_id
				`;

			Occupancy.query(query, params, async (_err, _record) => {
				if (_err) return res.badRequest(_err);

				const data = _record['rows'];
				const categories = _.map(data, item => item.room_id);
				const booked_occupied = [];
				const booked_unoccupied = [];
				const not_booked_occupied = [];
				const not_booked_unoccupied = [];
				const no_data = [];

				let totalHours = 0;
				fields.hour.map(hour => {
					const headHour = +_.get(_.head(hour), 'hour');
					const headMinute = +_.get(_.head(hour), 'minute');
					const lastHour = +_.get(_.last(hour), 'hour');
					const lastMinute = +_.get(_.last(hour), 'minute');
					if (headHour > lastHour) {
						for (let i = headHour; i < 24; i++) {
							totalHours++;
						}
						for (let i = 0; i < lastHour; i++) {
							totalHours++;
						}
					} else {
						totalHours += lastHour - headHour;
					}

					if (headMinute > 0) {
						totalHours = totalHours - (60 - headMinute) / 60;
					}
					if (lastMinute > 0) {
						totalHours = totalHours + lastMinute / 60;
					}
				});

				if (!fields.custom_hour) {
					totalHours++;
				}

				data.map(item => {
					const bookedOccupied = +(+item.booked_occupied * 100 / totalHours).toFixed(2);
					const bookedUnoccupied = +(+item.booked_unoccupied * 100 / totalHours).toFixed(2);
					const notBookedOccupied = +(+item.not_booked_occupied * 100 / totalHours).toFixed(2);
					const notBookedUnoccupied = +(+item.not_booked_unoccupied * 100 / totalHours).toFixed(2);

					booked_occupied.push(bookedOccupied);
					booked_unoccupied.push(bookedUnoccupied);
					not_booked_occupied.push(notBookedOccupied);
					not_booked_unoccupied.push(notBookedUnoccupied);
					no_data.push(+(100 - bookedOccupied - bookedUnoccupied - notBookedOccupied - notBookedUnoccupied).toFixed(2));
				});

				return res.ok({
					categories,
					booked_occupied,
					booked_unoccupied,
					not_booked_occupied,
					not_booked_unoccupied,
					no_data,
					random_room_id: filterContent.random_room_id
				});
			});
		} catch (err) {
			return res.badRequest(err);
		}
	}
}
