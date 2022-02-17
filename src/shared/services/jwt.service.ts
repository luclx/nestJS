'use strict';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTService {
	private tokenSecret;

	constructor(private configService: ConfigService) {
		let buff = Buffer.from(this.configService.get<string>('TOKEN_SECRET_KEY'), 'base64');
		this.tokenSecret = buff.toString('ascii');
	}

	public generateAccessToken(_payload) {
		_payload.type = 'access_token';
		_payload.time = new Date().getTime();
		return jwt.sign(
			_payload,
			this.tokenSecret,
			{
				expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE_TIME') ? this.configService.get<string>('ACCESS_TOKEN_EXPIRE_TIME') : '30d',
				algorithm: 'HS256'
			}
		);
	}

	public async verify(_token) {
		return new Promise((resolve, reject) => {
			jwt.verify(
				_token, // The token to be verified
				this.tokenSecret, // Same token we used to sign
				{}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
				(err, tokenDecode) => { //Pass errors or decoded token to callback
					if (err) return reject(err);
					return resolve(tokenDecode);
				}
			)
		});
	}

}
