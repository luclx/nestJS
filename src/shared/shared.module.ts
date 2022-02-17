import { Global, HttpModule, Module } from '@nestjs/common';
import { JWTService } from './services/jwt.service';

const providers = [JWTService];

@Global()
@Module({
    providers,
    imports: [
        HttpModule,
        JWTService
    ],
    exports: [...providers, HttpModule],
})
export class SharedModule { }
